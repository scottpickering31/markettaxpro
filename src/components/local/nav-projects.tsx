"use client";

import Link from "next/link";
import type { Route } from "next";
import { Forward, MoreHorizontal, Trash2, Pencil } from "lucide-react";
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
import * as React from "react";
import { useState } from "react";
import DeleteMarketplaceDialog from "@/components/dialogs/DeleteMarketplaceDialog";
import { DELETE_MARKETPLACE } from "@/api/marketplace/DeleteMarketplace";

type Project = {
  id: string;
  connectionId?: string;
  name: string;
  label?: string;
  url: string;
  icon: IconType;
};

export function NavProjects({ projects }: { projects: Project[] }) {
  const { isMobile, state } = useSidebar();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [target, setTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (item: Project) => {
    setTarget(item);
    setDeleteOpen(true);
  };

  const doDelete = async () => {
    if (!target) return;
    try {
      setIsDeleting(true);
      DELETE_MARKETPLACE(target.name);
      // TODO: Replace with your real deletion logic
      // e.g., await api.marketplaces.delete({ id: target.id, connectionId: target.connectionId })
      // Optional: router.refresh() or navigate away if on that page
      // For demo:
      await new Promise((r) => setTimeout(r, 900));
      // If you're on the deleted marketplace's page, you might redirect:
      // router.push("/marketplaces" as Route);
    } finally {
      setIsDeleting(false);
    }
  };

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
                    <item.icon className="h-8 w-8" aria-hidden />
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
                      <Forward className="text-muted-foreground" />
                      <span>Share Marketplace</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="text-muted-foreground" />
                      <span>Rename Marketplace</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteClick(item)}
                      className="text-destructive focus:text-destructive"
                    >
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

      {/* Controlled dialog lives once, outside the map */}
      <DeleteMarketplaceDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        marketplaceName={target?.name || target?.label || ""}
        onConfirm={doDelete}
        isLoading={isDeleting}
      />
    </SidebarGroup>
  );
}
