import logging
logger = logging.getLogger(__name__)

import os

from ... import server

server.register_component("basket.js", os.path.dirname(__file__))

from flask import request, abort
from flask_restful import Resource

from ...     import recaptcha, qr
from ...db   import orders
from ...mail import send

from mollie.api.client import Client

MOLLIE_API_KEY = os.environ.get("MOLLIE_API_KEY", None)
WEBSITE_URL    = os.environ.get("WEBSITE_URL", "https://nationofpositivity.com")

client = Client()
client.set_api_key(MOLLIE_API_KEY)

class Orders(Resource):
  def post(self):
    order = request.json

    # reCAPTCHA
    if not recaptcha.is_valid(order.pop("recaptcha", None)):
      return abort(400, "Google kon niet bevestigen dat je menselijk bent?! Probeer misschien opnieuw.")

    # construct validated and persisted order object
    try:
      order = orders.create(**order)
    except ValueError as ex:
      return abort(400, str(ex))

    response = { "id" : order.id }

    extra_info = ""

    if order.requires_payment:
      payment = client.payments.create({
        "amount": {
          "currency" : "EUR",
          "value"    : str(order.total.grand) 
        },
        "description": f"Betaling voor Nation of Positivity order {order.id}",
        "redirectUrl": f"{WEBSITE_URL}/order/{order.id}",
        "webhookUrl" : f"{WEBSITE_URL}/api/payment/{order.id}"
      })
      orders.update(order.id, payment=payment.id, status=None)
      response["next"] = payment.checkout_url

    # always until Mollie is integrated
    order_id = str(order.id)
    structured = '/'.join((order_id[:2],order_id[3:-5],order_id[-5:]))
    extra_info = f"""
<p>

  Je koos voor betaling via overschrijving. Gelieve &euro; {order.total.grand}
  over te schrijven naar BE14.7370.5585.6683. Gebruik het nummer van je order
  als gestructureerde mededeling: +++{structured}+++.

</p>

<p style="text-align:center">

  Je kan ook onderstaande QR code gebruiken in je banking app:<br>
  {qr.sepa_as_html_image(order.total.grand, structured)}

</p>
"""

    # send confirmation email
    send(
      order.contact.email,
      "Bedankt voor je order...",
      "Je order is goed ontvangen!",
      f"""
{extra_info}
<p>
  Zodra ik je betaling ontvangen heb, ga ik aan de slag. Je kan de voortgang van
  je order opvolgen op de <a href="{WEBSITE_URL}/order/{order.id}">website</a>.
</p>
<p>
  Alvast bedankt voor je order!<br>
  Christophe
</p>
""")

    return response

server.api.add_resource(Orders, "/api/orders")

class PaymentFeedback(Resource):
  def post(self, id):
    logger.info("FEEDBACK")
    order   = orders.get(id)
    payment = client.payments.get(request.form["id"])
    if order.payment == payment.id:
      logger.info(f"received payment feedback for order {id}: {payment.status}")
      if payment.is_paid:
        orders.update(order.id, paid_at=payment.paid_at)
      else:
        logger.info("not paid")
    else:
      logger.error("received feedback for order {id} with incorrect payment id: {payment.id}")

server.api.add_resource(PaymentFeedback, "/api/payment/<id>")
