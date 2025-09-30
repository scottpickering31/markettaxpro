"use client";

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  Pencil,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Route } from "next";

export function NavProjects({
  projects,
}: {
  projects: {
    id?: string;
    name: string;
    label?: string;
    url: string;
    icon: LucideIcon;
    connectionId?: string;
  }[];
}) {
  const { isMobile, state } = useSidebar();

  return (
    <SidebarGroup>
      {state === "expanded" && (
        <SidebarGroupLabel>Connected Marketplaces</SidebarGroupLabel>
      )}
      <SidebarMenu>
        {projects.length === 0 ? (
          <SidebarMenuItem>
            <SidebarMenuButton
              disabled
              className="justify-start text-muted-foreground"
            >
              No marketplaces connected yet
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          projects.map((item, index) => {
            const text = item.name || item.label || "Untitled";
            return (
              <SidebarMenuItem
                key={item.connectionId ?? item.id ?? `${item.name}-${index}`}
              >
                <SidebarMenuButton asChild tooltip={text}>
                  <Link href={item.url as Route}>
                    <item.icon />
                    <span>{text}</span>
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem>
                      <Folder className="text-muted-foreground" />
                      <span>View Marketplace</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Forward className="text-muted-foreground" />
                      <span>Share Marketplace</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="text-muted-foreground" />
                      <span>Rename Marketplace</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete Marketplace</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            );
          })
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
