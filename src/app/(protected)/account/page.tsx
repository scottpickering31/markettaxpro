import DeleteAccountButton from "@/components/auth/DeleteAccountButton";
import { selectMarketplaceAction } from "../marketplaces/actions";
import { getBusinessName } from "@/data/account";
import { saveBusinessNameAction } from "./actions";

export default async function AccountPage() {
  const conns = await selectMarketplaceAction();
  const businessName = await getBusinessName();

  return (
    <div className="max-w-2xl space-y-8">
      <section>
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="text-sm text-gray-600">
          Manage your profile and connections.
        </p>
      </section>

      <form action={saveBusinessNameAction} className="space-y-3">
        <div>
          <label className="text-4xl font-bold">
            {businessName || "Business name"}{" "}
          </label>
          <input
            name="business_name"
            defaultValue={businessName ?? ""}
            placeholder="Business name"
            className="mt-1 w-full rounded border px-3 py-2"
            required
          />
        </div>
        <button className="rounded bg-gray-900 px-3 py-2 text-white cursor-pointer">
          Save
        </button>
      </form>

      <section>
        <h2 className="font-medium">Connected marketplaces</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {(conns ?? []).map((c) => (
            <li key={c.id ?? c.platform}>
              ✅ {c.platform}
              {c.connected_at && (
                <> (since {new Date(c.connected_at).toLocaleDateString()})</>
              )}
            </li>
          ))}
          {!conns?.length && <li>No accounts connected.</li>}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Data</h2>
        <a href="/api/export/csv" className="rounded border px-3 py-2 text-sm">
          Download CSV
        </a>
        <DeleteAccountButton />
      </section>
    </div>
  );
}
