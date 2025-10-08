import { createClient } from "@/lib/supabase/server";

export const DELETE_MARKETPLACE = async (marketplaceName: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("marketplace_accounts")
    .delete()
    .eq("marketplace_name", marketplaceName);
  return error;
};
