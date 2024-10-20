import logging
import os
from pathlib import Path

from dotenv import load_dotenv, find_dotenv

logger = logging.getLogger(__name__)

# load the environment variables for this setup
load_dotenv(find_dotenv())
load_dotenv(find_dotenv(".env.local"))

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
  "urllib3"
]:
  module_logger = logging.getLogger(module)
  module_logger.setLevel(logging.WARN)
  if len(module_logger.handlers) > 0:
    module_logger.handlers[0].setFormatter(formatter)

# all set up, now get our server

from baseweb import Baseweb
server = Baseweb("nation-of-positivity")

HERE       = Path(__file__).resolve().parent
COMPONENTS = HERE / "components"

server.register_component("app.js", HERE)

server.app_static_folder = HERE / "static"

logger.info("✅ shop is ready")
