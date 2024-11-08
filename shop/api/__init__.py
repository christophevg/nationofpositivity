import logging
logger = logging.getLogger(__name__)

import os

from flask import abort, request
from flask_restful import Resource

from .. import server
from .. import db

class News(Resource):
  def get(self):
    return db.news.find(_available=None, _findable=None, sort="when", order="desc")
    
server.api.add_resource(News, "/api/news")

class Products(Resource):
  def get(self):
    return db.products.find(**request.args, sort="unit_price")
    
server.api.add_resource(Products, "/api/products")

class Product(Resource):
  def get(self, id):
   product = db.products.get(id)
   if not product:
     abort(404)
   return product.asdict()
    
server.api.add_resource(Product, "/api/products/<id>")

class Order(Resource):
  def get(self, id):
   order = db.orders.get(id)
   if not order:
     abort(404)
   return order.asdict()
    
server.api.add_resource(Order, "/api/orders/<id>")

from . import basket
