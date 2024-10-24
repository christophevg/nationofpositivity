import logging
logger = logging.getLogger(__name__)

import os

from flask import request
from flask_restful import Resource

from shop import server

server.register_component("products.js", os.path.dirname(__file__))

from shop.db import products

class Products(Resource):
  def get(self):
    return products.find(**request.args)
    
server.api.add_resource(Products, "/api/products")
