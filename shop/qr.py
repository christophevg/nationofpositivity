import qrcode
import base64
from io import BytesIO


def sepa_as_base64(amount, message):
  data = f"""BCD
001
1
SCT
KREDBEBB
2Know BV
BE14737055856683
EUR{amount}
GDDS
{message}"""

  img = qrcode.make(data, box_size=5)
  buffered = BytesIO()
  img.save(buffered, format="PNG")
  return base64.b64encode(buffered.getvalue()).decode("utf-8")

def sepa_as_html_image(amount, message):
  img_str = sepa_as_base64(amount, message)
  return f"""<img src="data:image/png;base64,{img_str}"/>"""

if __name__ == "__main__":
  print(sepa_as_base64("1.00", "mededeling"))
  print(sepa_as_html_image("1.00", "mededeling"))
