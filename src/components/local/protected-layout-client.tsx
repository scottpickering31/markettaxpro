// components/local/protected-layout-client.tsx
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

// Import SVGs here (client)
import Amazon from "@/components/svgs/amazon.svg";
import Ebay from "@/components/svgs/ebay.svg";
import Etsy from "@/components/svgs/etsy.svg";
import Shopify from "@/components/svgs/shopify.svg";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

type Platform = "ebay" | "etsy" | "shopify" | "amazon-handmade";

const CATALOG: Record<
  Platform,
  {
    label: string;
    url: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    description: string;
  }
> = {
  ebay: {
    label: "eBay Store",
    url: "/marketplaces/ebay",
    icon: Ebay,
    description: "Import eBay sales, fees, and payouts in a single click.",
  },
  etsy: {
    label: "Etsy Shop",
    url: "/marketplaces/etsy",
    icon: Etsy,
    description:
      "Sync listings, orders, and deposits from your Etsy storefront.",
  },
  shopify: {
    label: "Shopify Store",
    url: "/marketplaces/shopify",
    icon: Shopify,
    description:
      "Keep your Shopify orders, refunds, and taxes in sync automatically.",
  },
  "amazon-handmade": {
    label: "Amazon Handmade",
    url: "/marketplaces/amazon-handmade",
    icon: Amazon,
    description:
      "Bring over your Amazon Handmade settlements and fees for easy reconciliation.",
  },
};

type Row = { platform: Platform; dbId: string; name: string };

type Props = {
  sidebarUser: SidebarUser;
  connectedRows: Row[];
  children: React.ReactNode;
};

export default function ProtectedLayoutClient({
  sidebarUser,
  connectedRows,
  children,
}: Props) {
  const [isMarketplaceDialogOpen, setIsMarketplaceDialogOpen] =
    React.useState(false);

  const params = useSearchParams();
  const router = useRouter();
  const error = params.get("ebay_error");
  const connected = params.get("connected");

  React.useEffect(() => {
    if (error) {
      if (error === "already_connected") {
        toast.error("This eBay store is already connected.");
        console.log("already connected");
      } else if (error === "token_exchange_failed") {
        toast.error("Could not authenticate with eBay. Please try again.");
      } else if (error === "identity_failed") {
        toast.error("Could not identify your eBay account.");
      } else {
        toast.error("Unknown error occurred.");
      }
    }
  }, [error, connected, router]);

  // Enrich rows with UI metadata (including the icon component) **on the client**
  const connectedFromDb = React.useMemo<ConnectedMarketplace[]>(
    () =>
      connectedRows
        .filter((r) => r.platform in CATALOG)
        .map((r) => {
          const meta = CATALOG[r.platform];
          return {
            id: r.platform, // platform id
            dbId: r.dbId,
            name: r.name,
            label: meta.label,
            url: meta.url,
            icon: meta.icon, // safe to use in client now
            description: meta.description,
          };
        }),
    [connectedRows]
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
        marketplaces={Object.entries(CATALOG).map(([id, meta]) => ({
          id,
          name: "",
          label: meta.label,
          description: meta.description,
        }))}
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
