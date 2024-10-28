import logging
logger = logging.getLogger(__name__)

import os

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Attachment, FileContent, FileType, FileName, Disposition, ContentId

SENDGRID_API_KEY  = os.environ["SENDGRID_API_KEY"]
SENDGRID_TEMPLATE = os.environ["SENDGRID_TEMPLATE"]

def create_attachment(content, filename, filetype="application/pdf", disposition="inline"):
  attachment = Attachment()
  attachment.file_content = FileContent(content)
  attachment.file_name    = FileName(filename)
  attachment.file_type    = FileType(filetype)
  attachment.disposition  = Disposition(disposition)
  attachment.content_id   = ContentId(filename)
  return attachment

def send(to, subject, title, body, attachment=None, template=SENDGRID_TEMPLATE):
  message = Mail(
    from_email = "contact@nationofpositivity.com",
    to_emails  =  to
  )
  message.bcc = "contact@nationofpositivity.com"
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
    logger.exception(e)
