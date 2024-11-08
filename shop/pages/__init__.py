from pathlib import Path

from .. import server

HERE = Path(__file__).resolve().parent

# register static pages
for page in [
  "welcome",
  "shop",
  "product",
  "basket",
  "order",
  "faq",
  "contact",
  "algemene-voorwaarden"
]:
  server.register_component(f"{page}.js", HERE)
