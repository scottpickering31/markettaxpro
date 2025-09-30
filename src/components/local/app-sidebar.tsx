"use client";

import * as React from "react";
import {
  Upload,
  Table,
  ReceiptText,
  Download,
  Plus,
  Star,
  type LucideIcon,
} from "lucide-react";
import { NavMain } from "@/components/local/nav-main";
import { NavProjects } from "@/components/local/nav-projects";
import { NavUser } from "@/components/local/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import BrandHeader from "../ui/brand-header";
import Link from "next/link";
import { Route } from "next";

export type SidebarUser = {
  email: string;
  name?: string | null;
  avatar_url?: string | null;
};

export type ConnectedMarketplace = {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: SidebarUser;
  connectedMarketplaces?: ConnectedMarketplace[];
  onAddMarketplace?: () => void;
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
  upgrade: {
    title: "Upgrade to Pro",
    url: "/pricing" as Route,
    icon: Star,
  },
};

export function AppSidebar({
  user,
  connectedMarketplaces = [],
  onAddMarketplace,
  ...props
}: AppSidebarProps) {
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props} className="relative">
      <SidebarHeader>
        <BrandHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenuButton
          tooltip={"Add a Marketplace"}
          type="button"
          onClick={() => onAddMarketplace?.()}
          className="cursor-pointer w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-800 h-15 text-white rounded-none text-sm font-bold hover:text-white text-center group-data-[collapsible=icon]:bg-none group-data-[collapsible=icon]:text-black group-data-[collapsible=icon]:hover:text-black hover:from-blue-800 hover:via-blue-600 hover:to-blue-500"
        >
          <Plus className="me-2 h-4 w-4" />
          {state === "expanded" ? "Add a Marketplace" : null}
        </SidebarMenuButton>
        <NavProjects projects={connectedMarketplaces} />
        <NavMain items={data.navMain} />
        <SidebarMenuButton
          asChild
          tooltip={data.upgrade.title}
          className="flex justify-center group-data-[collapsible=icon]:justify-normal "
        >
          <Link href={data.upgrade.url}>
            <Star className="me-2 h-4 w-4" />
            {state === "expanded" ? data.upgrade.title : null}
          </Link>
        </SidebarMenuButton>
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
