"use client";

import * as React from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  AppSidebar,
  type ConnectedMarketplace,
  type SidebarUser,
} from "@/components/local/app-sidebar";
import { MarketplaceDialog } from "@/components/notifications/MarketplaceDialog";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Separator } from "@/components/ui/separator";
import AutoBreadcrumbs from "@/components/nav/AutoBreadcrumbs";
import { Store, ShoppingCart, ShoppingBag, Package } from "lucide-react";

type MarketplaceCatalogItem = ConnectedMarketplace & {
  description: string;
};

const MARKETPLACE_CATALOG: MarketplaceCatalogItem[] = [
  {
    id: "ebay",
    label: "eBay Store",
    name: "",
    url: "/marketplaces/ebay",
    icon: ShoppingCart,
    description: "Import eBay sales, fees, and payouts in a single click.",
  },
  {
    id: "etsy",
    label: "Etsy Shop",
    name: "",
    url: "/marketplaces/etsy",
    icon: Store,
    description:
      "Sync listings, orders, and deposits from your Etsy storefront.",
  },
  {
    id: "shopify",
    label: "Shopify Store",
    name: "",
    url: "/marketplaces/shopify",
    icon: ShoppingBag,
    description:
      "Keep your Shopify orders, refunds, and taxes in sync automatically.",
  },
  {
    id: "amazon-handmade",
    label: "Amazon Handmade",
    name: "",
    url: "/marketplaces/amazon-handmade",
    icon: Package,
    description:
      "Bring over your Amazon Handmade settlements and fees for easy reconciliation.",
  },
];

const DEFAULT_CONNECTED_IDS = [""];

type ProtectedLayoutClientProps = {
  sidebarUser: SidebarUser;
  children: React.ReactNode;
};

export default function ProtectedLayoutClient({
  sidebarUser,
  children,
}: ProtectedLayoutClientProps) {
  const [connectedMarketplaces, setConnectedMarketplaces] = React.useState<
    ConnectedMarketplace[]
  >(() =>
    MARKETPLACE_CATALOG.filter((marketplace) =>
      DEFAULT_CONNECTED_IDS.includes(marketplace.id)
    )
  );
  const [isMarketplaceDialogOpen, setIsMarketplaceDialogOpen] =
    React.useState(false);

  const handleConnectMarketplace = React.useCallback(
    (marketplaceId: string) => {
      const marketplace = MARKETPLACE_CATALOG.find(
        (item) => item.id === marketplaceId
      );

      if (!marketplace) {
        return;
      }

      setConnectedMarketplaces((prev) => [...prev, marketplace]);
    },
    []
  );

  return (
    <SidebarProvider>
      <AppSidebar
        user={sidebarUser}
        connectedMarketplaces={connectedMarketplaces}
        onAddMarketplace={() => setIsMarketplaceDialogOpen(true)}
      />
      <MarketplaceDialog
        open={isMarketplaceDialogOpen}
        onOpenChange={setIsMarketplaceDialogOpen}
        marketplaces={MARKETPLACE_CATALOG.map((marketplace) => ({
          id: marketplace.id,
          name: marketplace.name,
          label: marketplace.label,
          description: marketplace.description,
        }))}
        onConnect={(marketplaceId) => {
          handleConnectMarketplace(marketplaceId);
        }}
      />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <ModeToggle />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <AutoBreadcrumbs
              labelMap={{
                transactions: "Transactions",
                costs: "Costs",
                "csv-export": "CSV Export",
                "pdf-export": "PDF Export",
              }}
            />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 px-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
