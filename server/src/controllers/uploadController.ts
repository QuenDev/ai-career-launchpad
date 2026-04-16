import { Request, Response } from "express";
import { PDFParse } from "pdf-parse";

export const extractPdfText = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    if (req.file.mimetype !== "application/pdf") {
      res.status(400).json({ error: "Only PDF files are allowed" });
      return;
    }

    if (req.file.size > 5 * 1024 * 1024) {
      res.status(400).json({ error: "File size must be less than 5MB" });
      return;
    }

    const pdf = new PDFParse({ data: new Uint8Array(req.file.buffer) });
    const textResult = await pdf.getText();
    const extractedText = textResult.text.trim();
    await pdf.destroy();

    if (!extractedText) {
      res.status(400).json({
        error:
          "Could not extract text from PDF. Make sure it's not a scanned image.",
      });
      return;
    }

    res.status(200).json({ text: extractedText });
  } catch (err) {
    console.error("PDF parse error:", err);
    res.status(500).json({ error: "Failed to process PDF. Please try again." });
  }
};
