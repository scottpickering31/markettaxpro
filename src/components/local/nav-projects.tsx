// components/local/nav-projects.tsx
"use client";

import Link from "next/link";
import type { Route } from "next";
import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  Pencil,
  type Icon,
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
import { IconType } from "./app-sidebar";

export function NavProjects({
  projects,
}: {
  projects: {
    id: string;
    connectionId?: string;
    name: string;
    label?: string;
    url: string;
    icon: IconType;
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
          projects.map((item) => {
            const text = item.name || item.label || "Untitled";
            return (
              <SidebarMenuItem key={item.connectionId}>
                <SidebarMenuButton asChild tooltip={text}>
                  <Link
                    href={{
                      pathname: item.url as Route,
                      query: { c: item.connectionId },
                    }}
                  >
                    <item.icon className="h-8 w-8" aria-hidden />{" "}
                    <span>{text}</span>
                  </Link>

                  {/*
                  //  use a clean dynamic route instead:
                  <Link href={`/marketplaces/${item.id}/${item.connectionId}` as Route}>
                    <item.icon />
                    <span>{text}</span>
                  </Link>
                  */}
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
