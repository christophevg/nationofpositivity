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

# expose CDN setting
cdn_uri = os.environ.get("CDN_URI", None) # might be empty string
server.settings["cdn"] = cdn_uri if cdn_uri else "http://localhost:4000/"

# register components, stylesheets,...
HERE       = Path(__file__).resolve().parent
COMPONENTS = HERE / "components"
STATIC     = HERE / "static"

server.app_static_folder = STATIC

server.register_stylesheet("style.css", STATIC / "css")

server.register_component("cdn.js",  COMPONENTS)
server.register_component("logo.js", COMPONENTS)

server.register_component("app.js", HERE)

# register pages
from .pages import welcome, faq, contact

logger.info("✅ shop is ready")
