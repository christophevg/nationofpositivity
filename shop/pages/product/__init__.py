import logging
logger = logging.getLogger(__name__)

import os

from flask import request, abort
from flask_restful import Resource

from ... import server

server.register_component("product.js", os.path.dirname(__file__))

from ...db import products

class Product(Resource):
  def get(self, id):
   product = products.get(id)
   if not product:
     abort(404)
   return product.asdict()
    
server.api.add_resource(Product, "/api/products/<id>")
