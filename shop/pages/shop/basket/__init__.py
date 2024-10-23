import logging
logger = logging.getLogger(__name__)

import os

from shop import server

server.register_component("basket.js", os.path.dirname(__file__))

from flask import request, abort
from flask_restful import Resource

from shop      import recaptcha
from shop.db   import orders
from shop.mail import send

from shop.fake.payments import Client

client = Client()
client.set_api_key("test_....")

WEBSITE_URL = os.environ.get("WEBSITE_URL", "https://nationofpositivity.com")

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

    # initiate payment processing
    if order.requires_payment:
      payment = client.payments.create({
        "amount": {
          "currency" : "EUR",
          "value"    : str(order.total.grand) 
        },
        "description": f"Betaling voor Homemade order {order.id}",
        "redirectUrl": f"{WEBSITE_URL}/order/{order.id}",
        "webhookUrl" : f"{WEBSITE_URL}/orders/feedback"
      })
      orders.update(order.id, payment=payment.id)
      response["next"] = payment.checkout_url

    # send confirmation email
    send(
      order.contact.email,
      "Bedankt voor je order...",
      "Je order is goed ontvangen!",
      f"""
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
