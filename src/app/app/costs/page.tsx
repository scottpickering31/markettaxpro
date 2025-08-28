"use client";

import { useState, useEffect } from "react";
import ReceiptUploader from "@/src/components/upload/ReceiptUploader";

type Item = {
  id: string;
  date: string;
  category: string;
  amount_pence: number;
  note: string | null;
};

export default function CostsPage() {
  const [form, setForm] = useState({
    date: "",
    category: "packaging",
    amountGBP: "",
    note: "",
  });
  const [items, setItems] = useState<Item[]>([]);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/expenses/list", { cache: "no-store" });
    if (res.ok) setItems(await res.json());
  }
  useEffect(() => {
    void load();
  }, []);

  async function addExpense(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/expenses/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, amountGBP: Number(form.amountGBP) }),
    });
    setSaving(false);
    if (res.ok) {
      setForm({ date: "", category: "packaging", amountGBP: "", note: "" });
      await load();
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Costs & Receipts</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={addExpense} className="rounded border p-4 space-y-3">
          <div className="font-medium">Add an expense</div>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm">
              Date
              <input
                type="date"
                className="border rounded px-2 py-1 w-full"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                required
              />
            </label>
            <label className="text-sm">
              Category
              <select
                className="border rounded px-2 py-1 w-full"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
              >
                <option value="packaging">Packaging</option>
                <option value="postage">Postage</option>
                <option value="software">Software</option>
                <option value="travel">Travel</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="text-sm">
              Amount (GBP)
              <input
                className="border rounded px-2 py-1 w-full"
                inputMode="decimal"
                placeholder="0.00"
                value={form.amountGBP}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amountGBP: e.target.value }))
                }
                required
              />
            </label>
            <label className="text-sm col-span-2">
              Note
              <input
                className="border rounded px-2 py-1 w-full"
                value={form.note}
                onChange={(e) =>
                  setForm((f) => ({ ...f, note: e.target.value }))
                }
              />
            </label>
          </div>
          <button
            className="px-3 py-2 rounded bg-gray-900 text-white disabled:opacity-50"
            disabled={saving}
          >
            {saving ? "Saving…" : "Add expense"}
          </button>
        </form>

        <ReceiptUploader />
      </div>

      <div className="rounded border overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>Date</Th>
              <Th>Category</Th>
              <Th>Amount</Th>
              <Th>Note</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-t">
                <Td>{i.date}</Td>
                <Td className="capitalize">{i.category}</Td>
                <Td>£{(i.amount_pence / 100).toFixed(2)}</Td>
                <Td>{i.note ?? "-"}</Td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan={4}>
                  No expenses yet
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
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2">{children}</td>;
}
