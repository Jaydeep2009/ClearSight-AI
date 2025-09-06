// src/utils/parseLogs.js
export function parseLogs(buffer) {
  const text = buffer.toString("utf-8");
  const lines = text.split("\n").map((line, i) => ({
    lineNo: i + 1,
    text: line.trim(),
  }));

  return {
    rawParsed: { text },
    parsedData: lines.filter((l) => l.text.length > 0),
  };
}
