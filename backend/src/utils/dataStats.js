// utils/dataStats.js
export function computeStats(parsedData) {
  if (!Array.isArray(parsedData) || parsedData.length === 0) {
    return { rows: 0, columns: 0, missingValues: {}, columnTypes: {} };
  }

  const rows = parsedData.length;
  const columns = Object.keys(parsedData[0] || {});
  const missingValues = {};
  const columnTypes = {};

  for (const col of columns) {
    let missing = 0;
    let typeCounts = { string: 0, number: 0, boolean: 0, object: 0 };

    for (const row of parsedData) {
      const value = row[col];
      if (value === null || value === undefined || value === "") {
        missing++;
      } else {
        const t = typeof value;
        if (typeCounts[t] !== undefined) typeCounts[t]++;
        else typeCounts.object++;
      }
    }

    missingValues[col] = missing;
    columnTypes[col] = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0];
  }

  return {
    rows,
    columns: columns.length,
    missingValues,
    columnTypes,
  };
}
