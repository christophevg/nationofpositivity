# a fake payment provider for testing purposes

from flask import request

import dataclasses
from dataclasses import dataclass, field
from typing import Dict

import uuid


from flask_restful import Resource

from shop  import server

from shop.db import Collection, db, BaseObject

def uid():
  return str(uuid.uuid4())

@dataclass
class Payment(BaseObject):
  amount      : Dict[str, str]
  description : str
  redirectUrl : str
  webhookUrl  : str
  id          : str = field(default_factory=uid)
  
  @property
  def checkout_url(self):
    return f"/payments/pay/{self.id}"

payments = Collection(db, "payments", Payment)

class Client:
  def __init__(self):
    self.payments = payments

  def set_api_key(self, key):
    pass

@server.route("/payments/pay/<id>")
def show_payment_page(id):
  payment = payments.get(id)
  return f"""
<a href="/payments/confirm/{payment.id}">Pay {payment.amount['value']} {payment.amount['currency']}...</a>
"""

@server.route("/payments/confirm/<id>")
def process_payment_page(id):
  payment = payments.get(id)
  # TODO send webhook
  return f"""
<h1>OK</h1>
<a href="{payment.redirectUrl}">Return to the shop...</a>
"""
