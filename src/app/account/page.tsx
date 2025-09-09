import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: conns } = await supabase
    .from("marketplace_accounts")
    .select("platform, connected_at")
    .eq("user_id", user.id);

  return (
    <div className="max-w-2xl space-y-8">
      <section>
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="text-sm text-gray-600">
          Manage your profile and connections.
        </p>
      </section>

      <form action="/api/account/profile" method="post" className="space-y-3">
        <div>
          <label className="text-sm">Business name</label>
          <input
            name="business_name"
            defaultValue="Business name"
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>
        <button className="rounded bg-gray-900 px-3 py-2 text-white">
          Save
        </button>
      </form>

      <section>
        <h2 className="font-medium">Connected marketplaces</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {(conns ?? []).map((c) => (
            <li key={c.platform}>
              ✅ {c.platform} (since{" "}
              {new Date(c.connected_at!).toLocaleDateString()})
            </li>
          ))}
          {!conns?.length && <li>No accounts connected.</li>}
        </ul>
        <div className="mt-3 flex gap-2">
          <a href="/api/etsy/authorize" className="rounded border px-3 py-2">
            Connect Etsy
          </a>
          <a href="/api/ebay/authorize" className="rounded border px-3 py-2">
            Connect eBay
          </a>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Data</h2>
        <a href="/api/export/csv" className="rounded border px-3 py-2 text-sm">
          Download CSV
        </a>
        <form action="/api/account/delete" method="post" className="inline">
          <button className="ml-2 rounded border px-3 py-2 text-sm text-red-600">
            Delete account
          </button>
        </form>
      </section>
    </div>
  );
}
