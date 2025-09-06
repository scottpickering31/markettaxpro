import { createClient } from "@/lib/supabase/server";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/supabase/database.types";

type Transaction = Tables<"transactions">;
type Summary = Tables<"summaries">;
type Profile = Tables<"profiles">;

export async function upsertProfile(userId: string, email: string) {
  const supabase = await createClient();
  await supabase
    .from("profiles")
    .upsert({ id: userId, email })
    .select()
    .single();
}

export async function insertTransactions(
  userId: string,
  rows: Omit<Transaction, "id" | "created_at" | "user_id">[]
) {
  const supabase = await createClient();
  const insertRows = rows.map((r) => ({ ...r, user_id: userId }));
  const { error } = await supabase.from("transactions").insert(insertRows);
  if (error) throw new Error(error.message);
}

export async function listTransactions(
  userId: string,
  taxYear: string
): Promise<Transaction[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("cash_date", { ascending: true });
  if (error) throw new Error(error.message);
  // Filter by tax-year range client-side (simple for now)
  return data as unknown as Transaction[];
}

export async function recomputeYearSummary(userId: string, taxYear: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);

  let gross = 0,
    shipIn = 0,
    fees = 0,
    labels = 0;
  for (const r of data ?? []) {
    if (r.is_personal) continue;
    switch (r.type) {
      case "sale":
        gross += r.amount_pence;
        break;
      case "shipping_income":
        shipIn += r.amount_pence;
        break;
      case "fee":
        fees += r.amount_pence;
        break;
      case "shipping_label":
        labels += r.amount_pence;
        break;
    }
  }

  // COGS + manual expenses
  const { data: cogs } = await supabase
    .from("cogs")
    .select("amount_pence")
    .eq("user_id", userId);
  const cogsTotal = (cogs ?? []).reduce((a, b) => a + (b.amount_pence || 0), 0);

  const { data: manual } = await supabase
    .from("manual_expenses")
    .select("amount_pence")
    .eq("user_id", userId);
  const manualTotal = (manual ?? []).reduce(
    (a, b) => a + Math.abs(b.amount_pence || 0),
    0
  ); // manual stored positive

  const profitBeforeAllowance =
    gross + shipIn + fees + labels - cogsTotal - manualTotal;

  const up: Omit<Summary, "id"> = {
    user_id: userId,
    period: taxYear,
    gross_sales_pence: gross,
    shipping_income_pence: shipIn,
    fees_pence: fees,
    shipping_labels_pence: labels,
    cogs_pence: cogsTotal,
    manual_pence: manualTotal,
    profit_before_allowance_pence: profitBeforeAllowance,
    updated_at: new Date().toISOString(),
  };

  const { error: upErr } = await supabase
    .from("summaries")
    .upsert(
      { ...up, updated_at: new Date().toISOString() },
      { onConflict: "user_id,period" }
    );
  if (upErr) throw new Error(upErr.message);

  return up;
}

export async function listYearSummary(userId: string, taxYear: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("summaries")
    .select("*")
    .eq("user_id", userId)
    .eq("period", taxYear)
    .single();
  return data as Summary | null;
}
