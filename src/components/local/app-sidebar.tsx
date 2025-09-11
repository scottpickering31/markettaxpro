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
} from "@/components/ui/sidebar";
import BrandHeader from "../ui/brand-header";
import { Button } from "../ui/button";

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
    // {
    //   title: "Connect Marketplace",
    //   url: "/connect",
    //   icon: Store,
    //   items: [
    //     { title: "Connect Etsy", url: "/connect/etsy" },
    //     { title: "Connect eBay", url: "/connect/ebay" },
    //   ],
    // },
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
  return (
    <Sidebar collapsible="icon" {...props} className="relative">
      <SidebarHeader>
        <BrandHeader />
      </SidebarHeader>
      <SidebarContent>
        <Button variant="secondary" className="w-full">
          <Plus className="me-2 h-4 w-4" />
          Add a Marketplace
        </Button>
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
