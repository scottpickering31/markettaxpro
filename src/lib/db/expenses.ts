import { createClient } from "@/lib/supabase/server";

export async function addManualExpense(
  userId: string,
  input: {
    date: string;
    category: string;
    amount_pence: number;
    note?: string;
  }
) {
  const supabase = await createClient();
  const { error } = await supabase.from("manual_expenses").insert({
    user_id: userId,
    date: input.date,
    category: input.category,
    amount_pence: input.amount_pence, // store positive; sum as positive
    note: input.note ?? null,
  });
  if (error) throw new Error(error.message);
}

export async function listManualExpenses(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("manual_expenses")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addCogs(
  userId: string,
  input: {
    method: "per_item" | "batch" | "percent_of_sale";
    amount_pence: number;
    order_id?: string;
    sku?: string;
    evidence_url?: string;
    notes?: string;
  }
) {
  const supabase = await createClient();
  const { error } = await supabase.from("cogs").insert({
    user_id: userId,
    method: input.method,
    amount_pence: input.amount_pence,
    order_id: input.order_id ?? null,
    sku: input.sku ?? null,
    evidence_url: input.evidence_url ?? null,
    notes: input.notes ?? null,
  });
  if (error) throw new Error(error.message);
}

export async function listCogs(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cogs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
