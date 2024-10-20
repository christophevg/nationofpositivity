import os

from ... import server

server.register_component("welcome.js", os.path.dirname(__file__))
