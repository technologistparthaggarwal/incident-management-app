import cds from '@sap/cds';
import { parse } from 'csv-parse/sync';

export default cds.service.impl(async function () {
  const { Items } = this.entities;

  this.on('importCSV', async (req) => {
    const csvText = req.data?.csv;

    if (!csvText || typeof csvText !== 'string' || !csvText.trim()) {
      return req.reject(400, 'Provide non-empty plain-text CSV in the "csv" field.');
    }

    let records;
    try {
      records = parse(csvText, {
        columns: true,          // use first row as headers
        skip_empty_lines: true,
        trim: true
      });
    } catch (e) {
      return req.reject(400, 'CSV parse failed: ' + e.message);
    }

    if (!Array.isArray(records) || records.length === 0) {
      return 'No rows found in CSV.';
    }

    // Map + validate rows
    const rows = [];
    for (const r of records) {
      // Minimal validation/conversion
      const name = (r.name ?? '').toString().trim();
      const category = (r.category ?? '').toString().trim();
      const qty = Number(r.qty ?? 0);
      const price = Number(r.price ?? 0);

      if (!name) continue; // skip empty names

      rows.push({
        ID: cds.utils.uuid(),
        name, category,
        qty: Number.isFinite(qty) ? qty : 0,
        price: Number.isFinite(price) ? price : 0
      });
    }

    if (rows.length === 0) return 'No valid rows to insert.';

    try {
      await cds.run(INSERT.into(Items).entries(rows));
      return `Imported ${rows.length} row(s) successfully.`;
    } catch (e) {
      req.reject(500, 'DB insert failed: ' + e.message);
    }
  });
});
