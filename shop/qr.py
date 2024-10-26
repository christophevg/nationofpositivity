import qrcode
import base64
from io import BytesIO


def sepa_as_html_image(amount, message):
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

  img = qrcode.make(data)
  buffered = BytesIO()
  img.save(buffered, format="PNG")
  img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

  return f"""<img width="150px" src="data:image/png;base64,{img_str}"/>"""

if __name__ == "__main__":
  print(qr_as_html_img("1.00", "mededeling"))
