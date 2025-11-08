import logging
logger = logging.getLogger(__name__)

import os

from flask import request, abort
from flask_restful import Resource

from .. import server, db

class NewsItems(Resource):
  def post(self):
    db.news.create(**request.json)

  def get(self):
    return db.news.find(_available=None, _findable=None, sort="when", order="desc")

  def delete(self):
    id = request.args.get("id")
    db.news.delete(id)

server.api.add_resource(NewsItems, "/api/admin/news", endpoint="api-admin-newsitems")

class NewsItem(Resource):
  def put(self, id):
    update = request.json
    update.pop("id", None)
    db.news.update(id, **update)

server.api.add_resource(NewsItem, "/api/admin/news/<id>", endpoint="api-admin-newsitem")

class Collections(Resource):
  def post(self):
    db.collections.create(**request.json)

  def get(self):
    return db.collections.find(_available=None, _findable=None, order="desc")

  def delete(self):
    id = request.args.get("id")
    db.collections.delete(id)

server.api.add_resource(Collections, "/api/admin/collections", endpoint="api-admin-collections")

class Collection(Resource):
  def put(self, id):
    update = request.json
    update.pop("id", None)
    db.collections.update(id, **update)

server.api.add_resource(Collection, "/api/admin/collections/<id>", endpoint="api-admin-collection")

class Products(Resource):
  def post(self):
    db.products.create(**request.json)

  def get(self):
   return db.products.find(_available=None, _findable=None, **request.args)

  def delete(self):
    id = request.args.get("id")
    db.products.delete(id)

server.api.add_resource(Products, "/api/admin/products", endpoint="api-admin-products")

class Product(Resource):
  def put(self, id):
    update = request.json
    update.pop("id", None)
    db.products.update(id, **update)

server.api.add_resource(Product, "/api/admin/products/<id>", endpoint="api-admin-product")

class Orders(Resource):
  def get(self):
    return db.orders.find(**request.args)

  def delete(self):
    id = request.args["id"]
    db.orders.delete(id)

server.api.add_resource(Orders, "/api/admin/orders", endpoint="api-admin-orders")

class Order(Resource):
  def patch(self, id):
    update = request.json
    update.pop("id", None)
    db.orders.update(id, **update)

server.api.add_resource(Order, "/api/admin/orders/<id>", endpoint="api-admin-order")
