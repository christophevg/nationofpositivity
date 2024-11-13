import logging
logger = logging.getLogger(__name__)

import os

from flask import request, abort
from flask_restful import Resource

if os.environ.get("FAKE_PAYMENTS", "no") == "yes":
  from ..fake.payments import Client
  logger.warn("""
▗▄▄▄▖ ▗▄▖ ▗▖ ▗▖▗▄▄▄▖    ▗▄▄▖  ▗▄▖▗▖  ▗▖▗▖  ▗▖▗▄▄▄▖▗▖  ▗▖▗▄▄▄▖▗▄▄▖
▐▌   ▐▌ ▐▌▐▌▗▞▘▐▌       ▐▌ ▐▌▐▌ ▐▌▝▚▞▘ ▐▛▚▞▜▌▐▌   ▐▛▚▖▐▌  █ ▐▌   
▐▛▀▀▘▐▛▀▜▌▐▛▚▖ ▐▛▀▀▘    ▐▛▀▘ ▐▛▀▜▌ ▐▌  ▐▌  ▐▌▐▛▀▀▘▐▌ ▝▜▌  █  ▝▀▚▖
▐▌   ▐▌ ▐▌▐▌ ▐▌▐▙▄▄▖    ▐▌   ▐▌ ▐▌ ▐▌  ▐▌  ▐▌▐▙▄▄▖▐▌  ▐▌  █ ▗▄▄▞▘                                                             
""")
else:
  from mollie.api.client import Client

from .. import server, recaptcha, qr, db, mail

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
      order = db.orders.create(**order)
      logger.info(f"🛒 new order created: {order.id}")
    except ValueError as ex:
      return abort(400, str(ex))

    response = { "id" : order.id }

    extra_info = ""
    attachment = None
    
    grand_total_string = f"{order.total.grand:.2f}"

    if order.requires_payment:
      payment = client.payments.create({
        "amount": {
          "currency" : "EUR",
          "value"    : grand_total_string 
        },
        "description": f"Betaling voor Nation of Positivity order {order.id}",
        "redirectUrl": f"{WEBSITE_URL}/order/{order.id}",
        "webhookUrl" : f"{WEBSITE_URL}/api/payment/{order.id}"
      })
      db.orders.update(order.id, payment_id=payment.id, status=None)
      response["next"] = payment.checkout_url
    else:
      order_id = str(order.id)
      structured = "+++"+'/'.join((order_id[:3],order_id[3:-5],order_id[-5:]))+"+++"
      attachment = mail.create_attachment(
        qr.sepa_as_base64(order.total.grand, structured),
        "qr.png",
        "image/png",
        "inline"
      )
      extra_info = f"""
  <p style="margin-top:15px">

    Je koos voor betaling via overschrijving. Gebruik onderstaande
    betalingsgegevens om je betaling vlot en correct uit te voeren.
  
  <table border="0" style="margin-top:10px">
    <tr>
      <td>Totaal bedrag</td>   <td>&euro; {grand_total_string}</td>
    </tr>
    <tr>
      <td>Op rekening</td>     <td>BE14 7370 5585 6683</td>
    </tr>
    <tr>
      <td>Met mededeling</td>  <td>{structured}</td>
    </tr>
    </table>

  </p>

  <p style="text-align:center;margin-top:15px;">

    Je kan ook onderstaande QR code gebruiken in je banking app:<br>
    <img src="cid:{attachment.content_id.get()}">

  </p>
  """

    # send confirmation email
    mail.send(
      order.contact.email,
      f"Bedankt voor je order! ({order.id})",
      "Je order is goed ontvangen!",
      f"""
<p>

  Bedankt voor je order. We gaan zo snel mogelijk en met veel zin aan de
  slag en houden je op de hoogte bij elke stap.

</p>

<p style="margin-top:15px">

  👉 Als je bijkomende informatie moest of wil aanleveren, mag je altijd reageren
  op deze email.

</p>

{extra_info}

<p style="margin-top:15px">

  Zodra ik je betaling ontvangen heb, ga ik aan de slag. Je kan de voortgang
  van je order opvolgen op onze <a
  href="{WEBSITE_URL}/order/{order.id}">website</a>. Deze link is persoonlijk
  en geheim, dus deel hem (en dus ook niet deze email) met anderen.

</p>

<p style="margin-top:15px">

  Christophe<br>
  Nation of Positivity

</p>
""",
     attachment
   )
    return response

server.api.add_resource(Orders, "/api/orders", endpoint="api-orders")

class PaymentFeedback(Resource):
  def post(self, id):
    order   = db.orders.get(id)
    payment = client.payments.get(request.form["id"])
    if order.payment_id == payment.id:
      logger.debug(f"received payment feedback for order {id}: {payment.status}")
      if payment.is_paid:
        db.orders.update(order.id, paid_at=payment.paid_at)
        logger.info(f"💰 {order.id} was paid online")
      else:
        logger.debug("not paid")
    else:
      logger.error("received feedback for order {id} with incorrect payment id: {payment.id}")

server.api.add_resource(PaymentFeedback, "/api/payment/<id>", endpoint="api-payment-id")
