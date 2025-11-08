import logging
logger = logging.getLogger(__name__)

import os
import json

from random import randint

import dataclasses
from dataclasses import dataclass, field, fields
from typing import List, Dict, get_origin
from datetime import datetime

import pymongo
from pageable_mongo import Pageable

is_local = False
DB_CONN = os.environ.get("MONGODB_URI", None)
if not DB_CONN:
  DB_CONN = "mongodb://localhost:27017/nation"
  logger.warn("""
         _____  _______ _______             ______  ______
 |      |     | |       |_____| |           |     \\ |_____]
 |_____ |_____| |_____  |     | |_____      |_____/ |_____]

""")
  is_local = True

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

  def log(self, action, *args):
    args = ", ".join([str(arg) for arg in args])
    logger.info(f"💾 {action} {self.name}: {args}")

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
    self.log("create", doc)
    self.collection.insert_one(dataclasses.asdict(doc))
    return doc

  def get(self, id, more_filters=None, can_fail=False):
    filters = {"id" : id}
    if more_filters:
      filters.update(more_filters)
    self.log("get", filters)
    data = self.collection.find_one(filters, { "_id" : False })
    if data:
      data = self.dataclass.sanitize(data)
      if data:
        obj = self.dataclass(**data)
        return obj
    if not can_fail:
      logger.warn(f"could not get {self.collection}/{id}")
    return None

  def find(self, sort=None, order=None, start=0, limit=25, more_filters=None, **kwargs):
    # construct quick lookup table for types
    typeof = {
      field.name : field.type
      for field in dataclasses.fields(self.dataclass)
    }

    # construct filters from additional kwargs
    # by default simply turn it into a regexp
    # in case the targetted field is a list, check for inclusion
    filters = {}
    for arg, value in kwargs.items():
      if get_origin(typeof[arg]) == list:
        filters[arg] = { "$all" : value.split(",") }
      else:
        filters[arg] = { "$regex" : value, "$options" : "i" }

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

    self.log("find", kwargs, f"{len(self.pageable_collection)} results")
    return results

  def update(self, id, **kwargs):
    kwargs["id"] = id
    update = self.dataclass.sanitize(kwargs)
    update.pop("id", None)
    self.log("update", id, update)
    self.collection.update_one({"id" : id}, { "$set" : update })

  def delete(self, id):
    self.log("delete", id)
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
  def sanitize(cls, args):
    # first filter only acceptable fields
    args = {
      k : v for k, v in args.items()
      if k in cls.__dict__["__dataclass_fields__"]
    }
    # next ensure all basic types are converted to their correct type
    for field in dataclasses.fields(cls):
      if field.type in [ int, float, str ] and field.name in args:
        args[field.name] = field.type(args[field.name])

    return args

  def asdict(self):
    return dataclasses.asdict(self)

  def __post_init__(self):
    # ensure all basic types are converted to their correct type
    for field in dataclasses.fields(self):
      value = getattr(self, field.name)
      if field.type in [ int, float, str ] and not isinstance(value, field.type):
        setattr(self, field.name, field.type(value))

@dataclass
class Product(BaseObject):
  id : str
  title: str
  unit_price: float

  _available: bool = False
  _findable: bool = False
  intro: str = ""
  description: str = ""
  images: List[str] = field(default_factory=list)
  tags: List[str] = field(default_factory=list)
  options: List[Dict] = field(default_factory=list)
  specifications: Dict[str, str] = field(default_factory=dict)
  shipping : str = ""

  def __repr__(self):
    return f"Product({self.id}, {self.title}, {self.unit_price})"

products = FilteredCollection(db, "products", Product)

@dataclass
class Option:
  option: str
  choice: str
  cost  : float

@dataclass
class OrderLine:
  product: Product
  amount: int
  unit_price: float
  line_total: float

  options: List[Option] = field(default_factory=list)

  def __post_init__(self):
    self.product = Product(**self.product)
    self.options = [ Option(**option) for option in self.options ]

  @property
  def total(self):
    return self.line_total

@dataclass
class Contact:
  name       : str
  address    : str
  postalcode : int
  city       : str
  email      : str

  phone      : str = ""  # deprecated

  company    : str = ""
  tax        : str = ""

  def __repr__(self):
    return f"Contact({self.name})"

def uid():
  def gen():
    num = randint(1000000000, 9999999999)
    mod = num % 97
    return f"{num}{mod}"

  for _ in range(5):
    option = gen()
    if not orders.get(option, can_fail=True):
      return option
    else:
      logger.debug(f"{option} exists")

  raise ValueException("could not generate id")

@dataclass
class OrderTotal:
  lines: float
  grand: float
  tax: float

  shipping: float = 0
  payment: float = 0

@dataclass
class Order(BaseObject):
  lines         : List[OrderLine]
  contact       : Contact
  total         : OrderTotal

  id            : str = field(default_factory=uid)
  created       : datetime = field(default_factory=datetime.now)

  payment_method: str = "overschrijving" # "bancontact",...
  payment_id    : str = ""               # reference for payment provider
  paid_at       : str = ""               # timestamp

  shipment      : str = ""               # reference from courier
  shipped_at    : str = ""               # timestamp
  delivered_at  : str = ""               # timestamp

  @classmethod
  def create(cls, **kwargs):
    try:
      order   = kwargs["order"]
      contact = kwargs["contact"]

      # validate order lines prices
      expected_total = 0
      shipping = {}
      for line in order["lines"]:
        # get fresh copy of product from db
        product = products.get(line["product"]["id"])

        options_price = 0
        for option in line["options"]:
          expected_option_cost = next((
            actual_option.get("cost",0) for actual_option in product.options
            if actual_option["model"] == option["option"]
          ))
          if option["cost"] != expected_option_cost:
            logger.warn(f"{option['option']}: {option['cost']} != expected: {expected_option_cost}")
            raise ValueError("incorrect option price detected")
          options_price += option["cost"]

        # check unit price
        if line["unit_price"] != product.unit_price + options_price:
          logger.warn(f"{line['product']['id']} = {line['unit_price']} != {product.unit_price}")
          raise ValueError("incorrect unit price detected")

        # line cost
        expected_line_total = (product.unit_price + options_price) * line["amount"]
        if line["line_total"] != expected_line_total:
          logger.warn(f"{line['product']['id']} = {line['line_total']} != {expected_line_total}")
          raise ValueError("incorrect line price detected")

        # track shipping needs
        group = product.shipping
        try:
          shipping[group] += line["amount"]
        except KeyError:
          shipping[group] = line["amount"]

        expected_total += expected_line_total

      # validate totals

      # lines total
      if order["total"]["lines"] != round(expected_total,2):
        logger.warn(f"{order['total']['lines']} != {expected_total}")
        raise ValueError("incorrect lines total detected")

      # shipping
      gls_cost = { "XS": 5.60, "S": 6.60, "M": 7.60, "L": 9.30, "XL": 12.90 }
      # { "XS" : 350,  "S"  : 500, "M"  : 650, "L"  : 800 }
      gls_grouping = {
        ""       : [ "XS", "S", "M", "L", "L", "L", "XL" ],
        "record" : [ "S",  "S", "M", "M", "L", "L", "XL" ]
      }
      boxes = {}
      for group, amount in shipping.items():
        amount = 7 if amount > 7 else amount
        box = gls_grouping[group][amount-1]
        try:
          boxes[box] += 1
        except KeyError:
          boxes[box] = 1
      expected_shipping_total = sum([ amount * gls_cost[box] for box, amount in boxes.items() ])
      if order["total"]["shipping"] != round(expected_shipping_total, 2):
        logger.warn(f"shipping {order['total']['shipping']} != expected {expected_shipping_total}")
        logger.warn(f"shipping: {shipping}")
        logger.warn(f"boxes: {boxes}")
        raise ValueError("incorrect shipping total detected")

      # payment
      expected_payment = 0 if order["payment_method"] == "overschrijving" else 0.47
      if order["total"]["payment"] != expected_payment:
        logger.warn(f"payment {order['total']['payment']} != expected {expected_payment}")

      # grand
      expected_grand_total = expected_total + expected_shipping_total + expected_payment
      if order["total"]["grand"] != round(expected_grand_total, 2):
        logger.warn(f"grand total: {order['total']['grand']} != {expected_grand_total}")
        raise ValueError("incorrect grand total detected")

      # tax
      expected_tax = expected_grand_total - (expected_grand_total / 1.21)
      if order["total"]["tax"] != round(expected_tax, 2):
        logger.warn(f"tax total: {order['total']['tax']} != {expected_tax}")
        raise ValueError("incorrect tax total detected")

      # create
      return cls(**order, contact=contact)
    except Exception as ex:
      logger.exception(ex)
      raise ValueError("Sorry, er ging iets mis. Controleer je mandje en probeer opnieuw.")

  def __post_init__(self):
    # further unmarshall nested dicts into objects
    self.lines    = [ OrderLine(**line) for line in self.lines ]
    self.total    = OrderTotal(**self.total)
    self.contact  = Contact(**self.contact)
    super().__post_init__()

  def __repr__(self):
    return f"Order({self.id}, {self.contact}, {len(self.lines)} item{'s' if len(self.lines) > 1 else ''})"

  @property
  def requires_payment(self):
    return self.total.payment > 0

orders = Collection(db, "orders",   Order)

@dataclass
class News(BaseObject):
  id        : str
  title     : str
  image     : str
  body      : str
  when      : datetime = field(default_factory=datetime.now)
  _available: bool = False

news = FilteredCollection(db, "news", News)

@dataclass
class ProductCollection(BaseObject):
  id    : str
  title : str

  _available: bool = False
  _findable : bool = False

  highlight       : bool = False
  highlight_image : str  = None

collections = FilteredCollection(db, "collections", ProductCollection)
