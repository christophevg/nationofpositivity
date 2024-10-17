from flask import Flask, render_template, Response

from jinja2 import Environment, FileSystemLoader, PackageLoader
from pathlib import Path

HERE      = Path(__file__).parent
TEMPLATES = HERE / "templates"
STATIC    = HERE / "static"

env = Environment(loader=FileSystemLoader(TEMPLATES))

app = Flask(
  "nationofpositivity",
  template_folder= TEMPLATES,
  static_folder= STATIC,
  static_url_path=""
)

app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.route("/")
def home():
  template = env.get_template("index.html")
  return template.render()
