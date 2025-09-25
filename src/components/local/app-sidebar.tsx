"use client";

import * as React from "react";
import {
  Upload,
  Table,
  ReceiptText,
  Download,
  Store,
  ShoppingCart,
  Plus,
} from "lucide-react";
import { NavMain } from "@/components/ui/nav-main";
import { NavProjects } from "@/components/ui/nav-projects";
import { NavUser } from "@/components/ui/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import BrandHeader from "../ui/brand-header";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SidebarUser = {
  email: string;
  name?: string | null;
  avatar_url?: string | null;
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: SidebarUser;
};

const data = {
  navMain: [
    {
      title: "Import CSV",
      url: "/connect",
      icon: Upload,
      items: [{ title: "Upload CSV", url: "/import" }],
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: Table,
      items: [{ title: "All", url: "/transactions" }],
    },
    {
      title: "Costs",
      url: "/costs",
      icon: ReceiptText,
      items: [{ title: "Overview", url: "/costs" }],
    },
    {
      title: "Export",
      url: "/export",
      icon: Download,
      items: [
        { title: "CSV Export", url: "/csv-export" },
        { title: "PDF Export", url: "/pdf-export" },
      ],
    },
  ],
  connectedMarketplaces: [
    { name: "Etsy Shop", url: "/marketplaces/etsy", icon: Store },
    { name: "eBay Store", url: "/marketplaces/ebay", icon: ShoppingCart },
  ],
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const { state, open, isMobile } = useSidebar();

  const isCollapsed =
    (!isMobile && state === "collapsed") || (isMobile && !open);
  return (
    <Sidebar collapsible="icon" {...props} className="relative">
      <SidebarHeader>
        <BrandHeader />
      </SidebarHeader>

      <SidebarContent>
        <div className="px-2 py-2">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-9 h-9">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add a Marketplace</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Add a Marketplace</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button variant="secondary" className="w-full justify-start">
              <Plus className="me-2 h-4 w-4" />
              Add a Marketplace
            </Button>
          )}
        </div>

        <NavProjects projects={data.connectedMarketplaces} />
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: user.name ?? "",
            email: user.email,
            avatar: user.avatar_url ?? "",
          }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
