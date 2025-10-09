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
import { MarketplaceDialog } from "@/components/dialogs/MarketplaceDialog";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Separator } from "@/components/ui/separator";
import AutoBreadcrumbs from "@/components/nav/AutoBreadcrumbs";
import Amazon from "@/components/svgs/amazon.svg";
import Ebay from "@/components/svgs/ebay.svg";
import Etsy from "@/components/svgs/etsy.svg";
import Shopify from "@/components/svgs/shopify.svg";

type MarketplaceCatalogItem = ConnectedMarketplace & {
  description: string;
};

const MARKETPLACE_CATALOG: MarketplaceCatalogItem[] = [
  {
    id: "ebay",
    label: "eBay Store",
    name: "",
    url: "/marketplaces/ebay",
    icon: Ebay,
    description: "Import eBay sales, fees, and payouts in a single click.",
  },
  {
    id: "etsy",
    label: "Etsy Shop",
    name: "",
    url: "/marketplaces/etsy",
    icon: Etsy,
    description:
      "Sync listings, orders, and deposits from your Etsy storefront.",
  },
  {
    id: "shopify",
    label: "Shopify Store",
    name: "",
    url: "/marketplaces/shopify",
    icon: Shopify,
    description:
      "Keep your Shopify orders, refunds, and taxes in sync automatically.",
  },
  {
    id: "amazon-handmade",
    label: "Amazon Handmade",
    name: "",
    url: "/marketplaces/amazon-handmade",
    icon: Amazon,
    description:
      "Bring over your Amazon Handmade settlements and fees for easy reconciliation.",
  },
];

const DEFAULT_CONNECTED_IDS = [""];

type ProtectedLayoutClientProps = {
  sidebarUser: SidebarUser;
  connectedFromDb: ConnectedMarketplace[];
  children: React.ReactNode;
};

export default function ProtectedLayoutClient({
  sidebarUser,
  connectedFromDb,
  children,
}: ProtectedLayoutClientProps) {
  const [isMarketplaceDialogOpen, setIsMarketplaceDialogOpen] =
    React.useState(false);

  // const handleConnectMarketplace = React.useCallback(
  //   ({
  //     id,
  //     marketplaceId,
  //     marketplaceName,
  //   }: {
  //     id: string;
  //     marketplaceId: string;
  //     marketplaceName: string;
  //   }) => {
  //     const template = MARKETPLACE_CATALOG.find((i) => i.id === marketplaceId);
  //     if (!template) return;

  //     setConnectedMarketplaces((prev) => {
  //       const finalName = (marketplaceName?.trim() || template.label).trim();
  //       if (!finalName) return prev;

  //       const normalized = finalName.toLowerCase();
  //       if (prev.some((c) => c.name.trim().toLowerCase() === normalized))
  //         return prev;

  //       return [
  //         ...prev,
  //         {
  //           ...template,
  //           dbId: id,
  //           name: finalName,
  //         },
  //       ];
  //     });
  //   },
  //   []
  // );

  // const availableMarketplaces = MARKETPLACE_CATALOG;

  const existingNames = React.useMemo(
    () => connectedFromDb.map((m) => m.name),
    [connectedFromDb]
  );

  return (
    <SidebarProvider>
      <AppSidebar
        user={sidebarUser}
        connectedMarketplaces={connectedFromDb}
        onAddMarketplace={() => setIsMarketplaceDialogOpen(true)}
      />

      <MarketplaceDialog
        open={isMarketplaceDialogOpen}
        onOpenChange={setIsMarketplaceDialogOpen}
        marketplaces={MARKETPLACE_CATALOG.map((m) => ({
          id: m.id,
          name: m.name,
          label: m.label,
          description: m.description,
        }))}
        existingConnectionNames={existingNames}
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
