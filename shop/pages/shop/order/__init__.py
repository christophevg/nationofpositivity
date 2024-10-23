import logging
logger = logging.getLogger(__name__)

import os

from flask import request, abort
from flask_restful import Resource

from shop import server

server.register_component("order.js", os.path.dirname(__file__))

from shop.db import orders

class Order(Resource):
  def get(self, id):
   order = orders.get(id)
   if not order:
     abort(404)
   return order.asdict()
    
server.api.add_resource(Order, "/api/orders/<id>")
