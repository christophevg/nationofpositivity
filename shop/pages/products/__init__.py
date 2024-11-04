import logging
logger = logging.getLogger(__name__)

import os

from flask import request
from flask_restful import Resource

from ... import server

server.register_component("products.js", os.path.dirname(__file__))

from ...db import products

class Products(Resource):
  def get(self):
    return products.find(**request.args, sort="unit_price")
    
server.api.add_resource(Products, "/api/products")
