export default function PDFExportPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Export PDF</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <a
          href="/api/export/pdf"
          className="rounded border p-4 hover:bg-gray-50"
        >
          <div className="font-medium">Download PDF</div>
          <p className="text-sm text-gray-600">
            Self-employment summary (copy into HMRC)
          </p>
        </a>
      </div>
      <p className="text-xs text-gray-500">
        Heads up: this is guidance only, not tax advice.
      </p>
    </div>
  );
}
