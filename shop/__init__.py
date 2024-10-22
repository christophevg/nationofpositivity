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
import shop.db

# all set up, now get our server

from baseweb import Baseweb
server = Baseweb("nation-of-positivity")
server.config["TEMPLATES_AUTO_RELOAD"] = True

# expose mode
server.settings["mode"]         = os.environ.get("APP_MODE", "production")
server.settings["mode_message"] = os.environ.get("APP_MODE_MESSAGE", None)

# expose CDN setting
cdn_uri = os.environ.get("CDN_URI", None) # might be empty string
server.settings["cdn"] = cdn_uri if cdn_uri else "http://localhost:4000/"

# register components
HERE       = Path(__file__).resolve().parent
COMPONENTS = HERE / "components"

for component in [
  "cdn",
  "ajax",
  "moment", "moment-timezone", "filters",
  "logo", "page",
  "i18n",
  "product-store", "ProductCard"
]:
  server.register_component(f"{component}.js", COMPONENTS)

# setup static hosting and style (which is static ;-))
STATIC = HERE / "static"
server.app_static_folder = STATIC
server.register_stylesheet("style.css", STATIC / "css")

# register pages
from .pages import welcome, faq, contact
from .pages.shop import products, product
from .pages.shop import basket

if os.environ.get("ADMIN_MODE") == "yes":
  logger.warn("""
     _       _           _         __  __           _      
    / \   __| |_ __ ___ (_)_ __   |  \/  | ___   __| | ___ 
   / _ \ / _` | '_ ` _ \| | '_ \  | |\/| |/ _ \ / _` |/ _ \\
  / ___ \ (_| | | | | | | | | | | | |  | | (_) | (_| |  __/
 /_/   \_\__,_|_| |_| |_|_|_| |_| |_|  |_|\___/ \__,_|\___|
                                                             
""")
  server.register_component("admin.js", COMPONENTS);
  from .pages.admin import products

logger.info("✅ shop is ready")
