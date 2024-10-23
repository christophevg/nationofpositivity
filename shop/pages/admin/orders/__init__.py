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
    
server.api.add_resource(Orders, "/api/admin/orders", endpoint="admin-orders")
