import json
import sys
from pathlib import Path

import pdfplumber
import pypdfium2 as pdfium


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: extract_pdf_preview.py <input_pdf> <output_png>", file=sys.stderr)
        return 1

    input_pdf = Path(sys.argv[1])
    output_png = Path(sys.argv[2])

    extracted_text_parts = []
    with pdfplumber.open(input_pdf) as pdf:
      for page in pdf.pages[:2]:
        text = page.extract_text() or ""
        if text.strip():
          extracted_text_parts.append(text.strip())

    pdf_doc = pdfium.PdfDocument(str(input_pdf))
    page = pdf_doc[0]
    bitmap = page.render(scale=2).to_pil()
    bitmap.save(output_png)
    page.close()
    pdf_doc.close()

    print(
        json.dumps(
            {
                "text": "\n\n".join(extracted_text_parts)[:6000],
                "preview_png": str(output_png),
            }
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
