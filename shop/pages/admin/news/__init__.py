import logging
logger = logging.getLogger(__name__)

import os

from flask import request, abort
from flask_restful import Resource

from .... import server
from ....db import news

server.register_component("admin-news.js", os.path.dirname(__file__))

class News(Resource):
  def post(self):
    news.create(**request.json)

  def get(self):
    return news.find(_available=None, _findable=None, sort="when", order="desc")

  def delete(self):
    id = request.args.get("id")
    news.delete(id)
    
server.api.add_resource(News, "/api/admin/news", endpoint="admin-news")

class NewsItem(Resource):
  def put(self, id):
    update = request.json
    update.pop("id", None)
    news.update(id, **update)

server.api.add_resource(NewsItem, "/api/admin/news/<id>", endpoint="admin-news-item")
