import { NextResponse } from "next/server";

/**
 * In Batch B this will pull normalized transactions from DB.
 * For now we return a simple header CSV body so wiring is complete.
 */
export const runtime = "nodejs";

export async function GET() {
  const headers = [
    "date",
    "orderId",
    "type",
    "amountPence",
    "currency",
    "notes",
  ].join(",");
  const body = headers + "\n"; // placeholder; replace with real rows
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="transactions.csv"`,
    },
  });
}
