import React from "react";

export default function ConnectPage() {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="font-medium mb-2">Connect shops (coming soon)</h2>
      <div className="flex gap-2">
        <button className="px-3 py-2 rounded border" disabled>
          Connect Etsy
        </button>
        <button className="px-3 py-2 rounded border" disabled>
          Connect eBay
        </button>
      </div>
    </div>
  );
}
