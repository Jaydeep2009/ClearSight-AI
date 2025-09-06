// src/utils/parsePDF.js
import pdfParse from "pdf-parse/lib/pdf-parse.js";


export async function parsePDF(buffer) {
  if (!(buffer instanceof Buffer)) {
    throw new Error("parsePDF expected a Buffer, got " + typeof buffer);
  }

  const data = await pdfParse(buffer);
  const lines = data.text.split("\n").map((line, i) => ({
    lineNo: i + 1,
    text: line.trim(),
  }));

  return {
    rawParsed: { text: data.text },
    parsedData: lines.filter((l) => l.text.length > 0),
  };
}
