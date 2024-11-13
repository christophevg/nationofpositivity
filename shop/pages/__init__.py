from pathlib import Path

from .. import server

HERE = Path(__file__).resolve().parent

# register static pages
for page, route in {
  "welcome"              : "/welcome",
  "shop"                 : "/shop",
  "product"              : "/products/<id?>",
  "basket"               : "/basket",
  "order"                : "/order/<id>",
  "faq"                  : "/faq",
  "contact"              : "/contact",
  "algemene-voorwaarden" : "/algemene-voorwaarden"
}.items():
  server.register_component(f"{page}.js", HERE, route=route)
