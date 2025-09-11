"use client";

import { useState } from "react";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function uploadCsv() {
    if (!file) return;
    setStatus("Uploading…");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/csv/upload", { method: "POST", body: fd });
    const json = await res.json();
    setStatus(res.ok ? `Imported ${json.rows} rows` : `Error: ${json.error}`);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Import sales</h1>
      <div className="rounded-lg border p-4 space-y-3">
        <p className="text-sm text-gray-700">
          Upload a CSV export (Etsy/eBay/Vinted/Depop). Expected columns:
          <code className="mx-1">
            date, order_id, type, amount, currency, notes
          </code>
        </p>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button
          className="px-3 py-2 rounded bg-brand-500 text-black hover:bg-brand-700"
          onClick={uploadCsv}
          disabled={!file}
        >
          Upload CSV
        </button>
        {status && <p className="text-sm">{status}</p>}
      </div>
    </div>
  );
}
