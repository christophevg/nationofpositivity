import logging
logger = logging.getLogger(__name__)

import os

from flask import request, abort
from flask_restful import Resource

from .... import server
from ....db import products

server.register_component("admin-products.js", os.path.dirname(__file__))

class Products(Resource):
  def post(self):
    products.create(**request.json)

  def get(self):
   return products.find(_available=None, _findable=None, **request.args)

  def delete(self):
    id = request.args.get("id")
    products.delete(id)
    
server.api.add_resource(Products, "/api/admin/products", endpoint="admin-products")

class Product(Resource):
  def put(self, id):
    update = request.json
    update.pop("id", None)
    products.update(id, **update)

server.api.add_resource(Product, "/api/admin/products/<id>", endpoint="admin-product")
