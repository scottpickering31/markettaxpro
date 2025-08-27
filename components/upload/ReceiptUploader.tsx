"use client";

import { useState } from "react";

export default function ReceiptUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function upload() {
    if (!file) return;
    setStatus("Uploading...");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/storage/receipt-upload", {
      method: "POST",
      body: fd,
    });
    const json = await res.json();
    setStatus(res.ok ? `Uploaded: ${json.path}` : `Error: ${json.error}`);
  }

  return (
    <div className="rounded border p-4 space-y-3">
      <div className="font-medium">Upload receipt</div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button
        onClick={upload}
        className="px-3 py-2 rounded bg-gray-900 text-white disabled:opacity-50"
        disabled={!file}
      >
        Upload
      </button>
      {status && <div className="text-sm text-gray-700">{status}</div>}
    </div>
  );
}
