// app/(protected)/account/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { setBusinessName } from "@/data/account";

export async function saveBusinessNameAction(formData: FormData) {
  const name = String(formData.get("business_name") || "").trim();
  console.log(name);
  if (!name) {
    throw new Error("Business name is required");
  }

  await setBusinessName(name);
  revalidatePath("/account");
}
