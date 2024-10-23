import logging
logger = logging.getLogger(__name__)

import os

import requests

RECAPTCHA_SERVER_KEY = os.environ.get("RECAPTCHA_SERVER_KEY",    None)
MINIMAL_SCORE        = float(os.environ.get("RECAPTCHA_MINIMAL_SCORE", "0.5"))

def is_valid(token):
  if token and RECAPTCHA_SERVER_KEY:
    result = requests.post(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        "secret": RECAPTCHA_SERVER_KEY,
        "response" : token
      }
    ).json()
    logger.info(f"recaptcha : {result}")
    return result["success"] and result["score"] >= MINIMAL_SCORE
  return True
