// app/(protected)/layout.tsx (Server Component)
import ProtectedLayoutClient from "@/components/local/protected-layout-client";
import { requireUser } from "@/lib/auth";
import { selectMarketplaceAction } from "./marketplaces/actions";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const rows = await selectMarketplaceAction();

  // Only pass serializable fields
  const connectedRows = (rows ?? []).map((r) => ({
    platform: r.platform as "ebay" | "etsy" | "shopify" | "amazon-handmade",
    dbId: r.id,
    name: r.marketplace_name,
  }));

  const sidebarUser = {
    email: user.email!,
    name: (user.user_metadata?.full_name as string | undefined) ?? null,
    avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
  };

  return (
    <ProtectedLayoutClient
      sidebarUser={sidebarUser}
      connectedRows={connectedRows} // <-- primitives only
    >
      {children}
    </ProtectedLayoutClient>
  );
}
