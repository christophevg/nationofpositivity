import logging
logger = logging.getLogger(__name__)

import os
import json

import pymongo

DB_CONN = os.environ.get("MONGODB_URI", "mongodb://localhost:27017/homemade")
DB_NAME = DB_CONN.split("/")[-1].split("?")[0]

try:
  client = pymongo.MongoClient(DB_CONN)
  logger.debug(json.dumps(client.server_info(), indent=2, default=str))
  db = client[DB_NAME]
except Exception as err:
  logger.exception(err)
