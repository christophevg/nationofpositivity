import logging
logger = logging.getLogger(__name__)

import os

from flask_restful import Resource

from ... import server

server.register_component("welcome.js", os.path.dirname(__file__))

from ...db import news

class Updates(Resource):
  def get(self):
    return news.find(_available=None, _findable=None, sort="when", order="desc")
    
server.api.add_resource(Updates, "/api/news")
