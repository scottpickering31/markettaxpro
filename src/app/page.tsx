import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function serializeSearchParams(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (typeof value === "string") {
      params.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    }
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const destination = session ? "/dashboard" : "/sign-in";
  const suffix = serializeSearchParams(searchParams);

  redirect(`${destination}${suffix}`);
}
