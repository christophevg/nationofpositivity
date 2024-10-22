import logging
logger = logging.getLogger(__name__)

import os
import json

import uuid

import dataclasses
from dataclasses import dataclass, field
from typing import List, Dict
from datetime import datetime

import pymongo
from pageable_mongo import Pageable

DB_CONN = os.environ.get("MONGODB_URI", "mongodb://localhost:27017/homemade")
DB_NAME = DB_CONN.split("/")[-1].split("?")[0]

try:
  client = pymongo.MongoClient(DB_CONN)
  logger.debug(json.dumps(client.server_info(), indent=2, default=str))
  db = client[DB_NAME]
except Exception as err:
  logger.exception(err)

class Collection():
  def __init__(self, db, name, dataclass):
    self.dataclass           = dataclass
    self.name                = name
    self.collection          = None
    self.pageable_collection = None
    self._db                 = None
    self.db                  = db  # it needs name and updates collections

  @property
  def db(self):
    return self._db
  
  @db.setter
  def db(self, new_db):
    self._db                 = new_db
    self.collection          = self.db[self.name]
    self.pageable_collection = Pageable(self.db)[self.name]

  
  def create(self, doc=None, **kwargs):
    if doc:
      doc = self.dataclass.create(**doc)
    elif kwargs:
      doc = self.dataclass.create(**kwargs)
    else:
      doc = self.dataclass.create()
    logger.info(f"create {self.name} : {doc}")
    self.collection.insert_one(dataclasses.asdict(doc))
    return doc

  def get(self, id, more_filters=None):
    logger.info(f"get {self.name} : {id} ")
    filters = {"id" : id}
    if more_filters:
      filters.update(more_filters)
    data = self.collection.find_one(filters, { "_id" : False })
    if data:
      return self.dataclass(**data)
    else:
      return None

  def find(self, sort=None, order=None, start=0, limit=25, more_filters=None, **kwargs):
    filters = {
      arg : { "$regex" : value, "$options" : "i" }
      for arg, value in kwargs.items()
    }
    if more_filters:
      filters.update(more_filters)
    
    self.pageable_collection.find(filters, { "_id": False })

    # add sorting
    if sort:
      self.pageable_collection.sort( sort, -1 if order == "desc" else 1)

    # add paging
    self.pageable_collection.skip(int(start))
    self.pageable_collection.limit(int(limit))

    results = { 
      "content"       : list(self.pageable_collection),
      "totalElements" : len(self.pageable_collection),
      "pageable"      : self.pageable_collection.pageable
    }
    
    logger.info(f"find {self.name} : {kwargs} = {len(self.pageable_collection)} results")
    return results

  def update(self, id, **kwargs):
    logger.info(f"update {self.name} : {kwargs}")
    self.collection.update_one({"id" : id}, { "$set" : self.dataclass.sanitize(kwargs) })

  def delete(self, id):
    logger.info(f"delete {self.name}: {id}")
    self.collection.delete_one({"id" : id})

class FilteredCollection(Collection):
  def get(self, id, _available=True):
    filters = {}
    if not _available is None:
      filters["_available"] = _available
    return super().get(id, more_filters=filters)
    
  def find(self, _available=True, _findable=True, **kwargs):
    filters = {}
    if not _available is None:
      filters["_available"] = _available
    if not _findable is None:
      filters["_findable"] = _findable
    return super().find(more_filters=filters, **kwargs)

@dataclass
class BaseObject:
  @classmethod
  def create(cls, **kwargs):
    return cls(**kwargs)
  
  @classmethod
  def sanitize(cls, product):
    return {
      k : v for k, v in product.items()
      if k in cls.__dict__["__dataclass_fields__"]
    }

  def asdict(self):
    return dataclasses.asdict(self)

@dataclass
class Product(BaseObject):
  id : str
  title: str
  unit_price: float

  _available: bool = False
  _findable: bool = False
  intro: str = None
  description: str = None
  images: List[str] = field(default_factory=list)
  tags: List[str] = field(default_factory=list)
  options: List[Dict] = field(default_factory=list)
  specifications: Dict[str, str] = field(default_factory=dict)

products = FilteredCollection(db, "products", Product)
