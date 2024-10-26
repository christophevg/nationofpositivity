import logging
logger = logging.getLogger(__name__)

import os

from flask import request
from flask_restful import Resource

from shop    import server
from shop.db import orders

server.register_component("admin-orders.js", os.path.dirname(__file__))

class Orders(Resource):
  def get(self):
    return orders.find(**request.args)

  def delete(self):
    id = request.args["id"]
    orders.delete(id)
    
server.api.add_resource(Orders, "/api/admin/orders", endpoint="admin-orders")

class Order(Resource):
  def patch(self, id):
    update = request.json
    update.pop("id", None)
    orders.update(id, **update)

server.api.add_resource(Order, "/api/admin/orders/<id>", endpoint="admin-order")
