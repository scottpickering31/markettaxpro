import { requireUser } from "@/lib/auth";
import ProtectedLayoutClient from "@/components/local/protected-layout-client";
import type { SidebarUser } from "@/components/local/app-sidebar";
import { selectMarketplaceAction } from "./marketplaces/actions";
import Ebay from "@/components/svgs/ebay.svg";
import Etsy from "@/components/svgs/etsy.svg";
import Shopify from "@/components/svgs/shopify.svg";
import Amazon from "@/components/svgs/amazon.svg";

const CATALOG = {
  ebay: { label: "eBay Store", url: "/marketplaces/ebay", icon: Ebay },
  etsy: { label: "Etsy Shop", url: "/marketplaces/etsy", icon: Etsy },
  shopify: {
    label: "Shopify Store",
    url: "/marketplaces/shopify",
    icon: Shopify,
  },
  "amazon-handmade": {
    label: "Amazon Handmade",
    url: "/marketplaces/amazon-handmade",
    icon: Amazon,
  },
} as const;

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  const rows = await selectMarketplaceAction();

  // Map DB rows → ConnectedMarketplace[]
  const connectedFromDb = (rows ?? [])
    .filter((r) => r.platform in CATALOG)
    .map((r) => {
      const meta = CATALOG[r.platform as keyof typeof CATALOG];
      return {
        id: r.platform,
        dbId: r.id,
        name: r.marketplace_name,
        label: meta.label,
        url: meta.url,
        icon: meta.icon,
      };
    });

  const sidebarUser: SidebarUser = {
    email: user.email!,
    name: (user.user_metadata?.full_name as string | undefined) ?? null,
    avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
  };

  return (
    <ProtectedLayoutClient
      sidebarUser={sidebarUser}
      connectedFromDb={connectedFromDb}
    >
      {children}
    </ProtectedLayoutClient>
  );
}
