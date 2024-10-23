import logging
logger = logging.getLogger(__name__)

import os

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Attachment, FileContent, FileType, FileName, Disposition, ContentId

SENDGRID_API_KEY  = os.environ["SENDGRID_API_KEY"]
SENDGRID_TEMPLATE = os.environ["SENDGRID_TEMPLATE"]

def create_attachment(content, filename, filetype="application/pdf"):
  attachment = Attachment()
  attachment.file_content = FileContent(content)
  attachment.file_name    = FileName(filename)
  attachment.file_type    = FileType(filetype)
  attachment.disposition  = Disposition('attachment')
  attachment.content_id   = ContentId(filename)
  return attachement

def send(to, subject, title, body, attachment=None, template=SENDGRID_TEMPLATE):
  message = Mail(
    from_email = "contact@homemadebycvg.com",
    to_emails  =  to
  )
  message.dynamic_template_data = {
    "subject": subject,
    "title"  : title,
    "html"   : body
  }
  message.template_id = template

  if attachment:
    message.attachment = attachment

  try:
    sg = SendGridAPIClient(SENDGRID_API_KEY)
    response = sg.send(message)
    code, body, headers = response.status_code, response.body, response.headers
    logger.info(f"sent mail to {to}: {subject} / {title} / {len(body)} => {code}")
  except Exception as e:
    logger.error(f"while sending mail to {to}: {subject} / {title} / {len(body)} => {e}")

# import base64
# file_path = "test.pdf"
# with open(file_path, 'rb') as f:
#   data = f.read()
# encoded = base64.b64encode(data).decode()
