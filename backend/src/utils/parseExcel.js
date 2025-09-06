// src/utils/parseExcel.js
import xlsx from "xlsx";
import { cleanRecords } from "./cleaner.js";

export function parseExcel(buffer) {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  let rawParsed = {};
  let parsedData = {};

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    rawParsed[sheetName] = rows;
    parsedData[sheetName] = cleanRecords(rows);
  });

  return { rawParsed, parsedData };
}
