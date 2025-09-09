"use client";

import * as React from "react";
import {
  Upload,
  Table,
  ReceiptText,
  Download,
  Store,
  ShoppingCart,
  Package,
} from "lucide-react";

import { NavMain } from "@/components/ui/nav-main";
import { NavProjects } from "@/components/ui/nav-projects";
import { NavUser } from "@/components/ui/nav-user";
import { TeamSwitcher } from "@/components/ui/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    { name: "Acme Inc", logo: Store, plan: "Enterprise" },
    { name: "Acme Corp.", logo: ShoppingCart, plan: "Startup" },
    { name: "Evil Corp.", logo: Package, plan: "Free" },
  ],
  navMain: [
    {
      title: "Import",
      url: "/import",
      icon: Upload,
      items: [
        { title: "Connect Accounts", url: "/import/connect" },
        { title: "Upload CSV", url: "/import/upload" },
        { title: "Sync Status", url: "/import/status" },
        { title: "Import Rules", url: "/import/rules" },
      ],
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: Table,
      items: [
        { title: "All", url: "/transactions" },
        { title: "Unreviewed", url: "/transactions/unreviewed" },
        { title: "Matches", url: "/transactions/matches" },
        { title: "Transfers", url: "/transactions/transfers" },
      ],
    },
    {
      title: "Costs",
      url: "/costs",
      icon: ReceiptText,
      items: [
        { title: "Overview", url: "/costs" },
        { title: "Categories", url: "/costs/categories" },
        { title: "Recurring", url: "/costs/recurring" },
        { title: "Receipts", url: "/costs/receipts" },
      ],
    },
    {
      title: "Export",
      url: "/export",
      icon: Download,
      items: [
        { title: "Reports", url: "/export/reports" },
        { title: "CSV Export", url: "/export/csv" },
        { title: "VAT Return", url: "/export/vat" },
        { title: "Year-end", url: "/export/year-end" },
      ],
    },
  ],
  projects: [
    { name: "Etsy Shop", url: "/shops/etsy", icon: Store },
    { name: "eBay Store", url: "/shops/ebay", icon: ShoppingCart },
    { name: "Amazon", url: "/shops/amazon", icon: Package },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
