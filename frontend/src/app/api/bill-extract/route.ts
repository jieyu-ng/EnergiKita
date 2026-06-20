import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

export const runtime = "nodejs";

const MODEL_ID = "grafilab/qwen3-vl-flash";
const execFileAsync = promisify(execFile);

export async function POST(request: Request) {
  const apiKey = process.env.GRAFILAB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GRAFILAB_API_KEY in frontend/.env.local." },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No bill file uploaded." }, { status: 400 });
  }

  if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Unsupported file type. Use a PNG, JPG, or JSON bill export." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
  let extractedPdfText = "";

  if (file.type === "application/pdf") {
    const tempDir = await mkdtemp(path.join(tmpdir(), "ek-bill-"));
    const pdfPath = path.join(tempDir, "bill.pdf");
    const pngPath = path.join(tempDir, "preview.png");

    try {
      await writeFile(pdfPath, buffer);
      const scriptPath = path.join(/* turbopackIgnore: true */ process.cwd(), "scripts", "extract_pdf_preview.py");
      const { stdout } = await execFileAsync("python", [scriptPath, pdfPath, pngPath], {
        cwd: process.cwd(),
      });
      const parsed = JSON.parse(stdout);
      extractedPdfText = parsed.text ?? "";
      const pngBuffer = await readFile(parsed.preview_png ?? pngPath);
      dataUrl = `data:image/png;base64,${pngBuffer.toString("base64")}`;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown PDF extraction error.";
      return NextResponse.json(
        { error: `Unable to process PDF bill locally: ${message}` },
        { status: 500 }
      );
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  }

  const response = await fetch("https://console-api.grafilab.ai/api/oai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL_ID,
      messages: [
        {
          role: "system",
          content: "You extract structured fields from Malaysian TNB bills. Return strict JSON only.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract the following fields from this TNB electricity bill and return only valid JSON:
{
  "billing_month": string,
  "consumption_kwh": number,
  "total_amount_rm": number,
  "billing_days": number,
  "confidence": number,
  "source": "image_extracted"
}

Rules:
- billing_month should be a stable month label like "2026-05" if possible.
- consumption_kwh must be numeric.
- total_amount_rm must be numeric.
- billing_days must be numeric.
- confidence must be between 0 and 1.
- If a field cannot be read, make your best estimate and lower confidence.
- This may be a PDF converted to image. Use both the visible bill and any extracted text below.

Extracted PDF text:
${extractedPdfText || "N/A"}`,
            },
            {
              type: "image_url",
              image_url: {
                url: dataUrl,
              },
            },
          ],
        },
      ],
      temperature: 0.1,
      top_p: 0.9,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json({ error: `Bill extraction failed: ${errorText}` }, { status: 502 });
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    return NextResponse.json({ error: "Grafilab returned an empty extraction response." }, { status: 502 });
  }

  try {
    const parsed = JSON.parse(content);
    return NextResponse.json({
      ...parsed,
      source: file.type === "application/pdf" ? "pdf_extracted" : parsed.source ?? "image_extracted",
      extraction_notes: [
        file.type === "application/pdf"
          ? "PDF processed locally into preview image plus extracted text before AI field extraction."
          : "Image sent directly to AI vision extraction.",
      ],
    });
  } catch {
    return NextResponse.json({ error: "Bill extraction returned invalid JSON." }, { status: 502 });
  }
}
