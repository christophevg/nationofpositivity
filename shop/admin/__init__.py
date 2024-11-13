from pathlib import Path

from .. import server

HERE = Path(__file__).resolve().parent

# register static pages
for page in [
  "navigation",
  "products",
  "orders",
  "news"
]:
  server.register_component(f"admin-{page}.js", HERE, route=f"/admin/{page}")

from . import api
