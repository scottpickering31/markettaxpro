"use client";

import { useMemo, useState } from "react";

type Row = {
  id: string;
  cash_date: string;
  platform: string;
  type:
    | "sale"
    | "fee"
    | "shipping_income"
    | "shipping_label"
    | "refund"
    | "other_expense";
  order_id: string | null;
  amount_pence: number;
  notes: string | null;
  is_personal: boolean;
};

export default function TransactionsTable({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (platform !== "all" && r.platform !== platform) return false;
      if (type !== "all" && r.type !== type) return false;
      if (
        query &&
        !(r.order_id ?? "").toLowerCase().includes(query.toLowerCase())
      )
        return false;
      if (from && r.cash_date < from) return false;
      if (to && r.cash_date > to) return false;
      return true;
    });
  }, [rows, platform, type, query, from, to]);

  const selectedIds = useMemo(
    () => Object.keys(selected).filter((id) => selected[id]),
    [selected]
  );

  async function bulkMark(personal: boolean) {
    if (!selectedIds.length) return;
    const res = await fetch("/api/transactions/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds, is_personal: personal }),
    });
    if (res.ok) window.location.reload();
  }

  function toggleAll() {
    const cur = { ...selected };
    const ids = filtered.map((r) => r.id);
    const allSelected = ids.every((id) => cur[id]);
    ids.forEach((id) => (cur[id] = !allSelected));
    setSelected(cur);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="block text-xs text-gray-600">Platform</label>
          <select
            className="border rounded px-2 py-1"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="all">All</option>
            <option value="etsy">Etsy</option>
            <option value="ebay">eBay</option>
            <option value="vinted">Vinted</option>
            <option value="depop">Depop</option>
            <option value="csv">CSV</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600">Type</label>
          <select
            className="border rounded px-2 py-1"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">All</option>
            {[
              "sale",
              "shipping_income",
              "fee",
              "shipping_label",
              "refund",
              "other_expense",
            ].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600">Order ID</label>
          <input
            className="border rounded px-2 py-1"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600">From</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600">To</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => bulkMark(true)}
            className="px-3 py-2 rounded bg-gray-900 text-white"
          >
            Mark Personal
          </button>
          <button
            onClick={() => bulkMark(false)}
            className="px-3 py-2 rounded border"
          >
            Unmark Personal
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>
                <input type="checkbox" onChange={toggleAll} />
              </Th>
              <Th>Date</Th>
              <Th>Platform</Th>
              <Th>Type</Th>
              <Th>Order</Th>
              <Th>Amount</Th>
              <Th>Personal</Th>
              <Th>Notes</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t">
                <Td>
                  <input
                    type="checkbox"
                    checked={!!selected[r.id]}
                    onChange={() =>
                      setSelected((s) => ({ ...s, [r.id]: !s[r.id] }))
                    }
                  />
                </Td>
                <Td>{r.cash_date}</Td>
                <Td className="capitalize">{r.platform}</Td>
                <Td>{r.type}</Td>
                <Td>{r.order_id ?? "-"}</Td>
                <Td
                  className={
                    r.amount_pence < 0 ? "text-red-600" : "text-green-700"
                  }
                >
                  £{(r.amount_pence / 100).toFixed(2)}
                </Td>
                <Td>{r.is_personal ? "Yes" : "No"}</Td>
                <Td>{r.notes ?? "-"}</Td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td className="px-3 py-8 text-center text-gray-500" colSpan={8}>
                  No rows
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-3 py-2 font-medium text-gray-700">
      {children}
    </th>
  );
}
function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-3 py-2 ${className ?? ""}`}>{children}</td>;
}
