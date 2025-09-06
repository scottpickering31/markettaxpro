import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await requireUser();
  const supabase = await createClient();

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File))
    return NextResponse.json({ error: "Missing file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const path = `${user.id}/${Date.now()}-${file.name.replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  )}`;

  const { error } = await supabase.storage
    .from("receipts")
    .upload(path, Buffer.from(bytes), {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ path });
}
