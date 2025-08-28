export type Profile = { id: string; email: string; created_at: string };
export type Transaction = {
  id: string;
  user_id: string;
  platform: "etsy" | "ebay" | "vinted" | "depop" | "csv";
  order_id: string | null;
  cash_date: string; // ISO date
  type:
    | "sale"
    | "fee"
    | "shipping_income"
    | "shipping_label"
    | "refund"
    | "other_expense";
  amount_pence: number;
  currency: string;
  notes: string | null;
  is_personal: boolean;
  source: "api" | "csv";
  source_ref: string | null;
  created_at: string;
};
export type Summary = {
  user_id: string;
  period: string;
  gross_sales_pence: number;
  shipping_income_pence: number;
  fees_pence: number;
  shipping_labels_pence: number;
  cogs_pence: number;
  manual_pence: number;
  profit_before_allowance_pence: number;
};
export type Database = unknown;
