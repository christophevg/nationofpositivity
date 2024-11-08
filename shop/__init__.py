import eventlet
eventlet.monkey_patch()

import logging
import os
from pathlib import Path

from dotenv import load_dotenv, find_dotenv

logger = logging.getLogger(__name__)

# load the environment variables for this setup
load_dotenv(find_dotenv())
load_dotenv(find_dotenv(".env.local"), override=True)

# setup logging infrastructure

LOG_LEVEL = os.environ.get("LOG_LEVEL") or "INFO"
FORMAT  = "[%(asctime)s] [%(name)s] [%(process)d] [%(levelname)s] %(message)s"
DATEFMT = "%Y-%m-%d %H:%M:%S %z"

logging.basicConfig(level=LOG_LEVEL, format=FORMAT, datefmt=DATEFMT)
formatter = logging.Formatter(FORMAT, DATEFMT)
logging.getLogger().handlers[0].setFormatter(formatter)

# "silence" lower-level modules
for module in [
  "gunicorn.error",
  "pymongo.serverSelection",
  "engineio.client", "engineio.server", "socketio.client", "socketio.server",
  "urllib3",
  "pymongo.topology", "pymongo.connection", "pymongo.command"
]:
  module_logger = logging.getLogger(module)
  module_logger.setLevel(logging.WARN)
  if len(module_logger.handlers) > 0:
    module_logger.handlers[0].setFormatter(formatter)

# setup datastore
from . import db

# all set up, now get our server

from baseweb import Baseweb
server = Baseweb("nation-of-positivity")
server.config["TEMPLATES_AUTO_RELOAD"] = True
server.log_config()

# improve json output generation
import json
from flask import make_response
from datetime import datetime

class Encoder(json.JSONEncoder):
  def default(self, o):
    if isinstance(o, datetime):
      return o.isoformat()
    if isinstance(o, set):
      return list(o)
    return super().default(o)

@server.api.representation("application/json")
def output_json(data, code, headers=None):
  resp = make_response(json.dumps(data, cls=Encoder), code)
  resp.headers.extend(headers or {})
  return resp

# expose mode
server.settings["mode"]         = os.environ.get("APP_MODE", "production")
server.settings["mode_message"] = os.environ.get("APP_MODE_MESSAGE", None)

# expose CDN setting
cdn_uri = os.environ.get("CDN_URI", None) # might be empty string
server.settings["cdn"] = cdn_uri if cdn_uri else "http://localhost:4000/"

# setup recaptcha
recaptcha_key = os.environ.get("APP_RECAPTCHA_SITE_KEY", None)
if recaptcha_key:
  server.settings["recaptcha"] = recaptcha_key
  server.register_external_script(f"https://www.google.com/recaptcha/api.js?render={recaptcha_key}")

HERE = Path(__file__).resolve().parent

# setup static hosting and style (which is static ;-))
STATIC = HERE / "static"
server.app_static_folder = STATIC
server.register_stylesheet("style.css", STATIC / "css")

# register additional boostrap icons
server.register_stylesheet("bootstrap-icons.min.css", STATIC / "css")

# register components
COMPONENTS = HERE / "components"

for component in [
  "cdn", "fonts",
  "ajax",
  "moment", "moment-timezone", "filters",
  "logo", "page",
  "i18n",
  "product-store", "basket-store", "contact-store", "news-store",
  "ProductCard", "OrderOverview", "ContactCard"
]:
  server.register_component(f"{component}.js", COMPONENTS)

# set up some globals (nav drawer setup, console logging utilities,...)
server.register_component(f"app.js", HERE)

# setup API and pages
from . import api, pages

# admin mode
if os.environ.get("ADMIN_MODE", "no") == "yes":
  from . import admin
  logger.warn("""
     _       _           _         __  __           _      
    / \   __| |_ __ ___ (_)_ __   |  \/  | ___   __| | ___ 
   / _ \ / _` | '_ ` _ \| | '_ \  | |\/| |/ _ \ / _` |/ _ \\
  / ___ \ (_| | | | | | | | | | | | |  | | (_) | (_| |  __/
 /_/   \_\__,_|_| |_| |_|_|_| |_| |_|  |_|\___/ \__,_|\___|
                                                             
""")

# ensure everything else is caught with a 404 page
server.register_component(f"404.js", HERE / "pages")

logger.info("✅ shop is ready")
