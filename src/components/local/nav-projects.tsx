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
import {
  deleteMarketplaceAction,
  renameMarketplaceAction,
} from "@/app/(protected)/marketplaces/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import RenameMarketplaceDialog from "../dialogs/RenameMarketplaceDialog";

type Project = {
  id: string;
  dbId?: string;
  connectionId?: string;
  name: string;
  label?: string;
  url: string;
  icon: IconType;
};

export function NavProjects({
  projects,
  onAfterDelete,
}: {
  projects: Project[];
  onAfterDelete?: (dbId?: string, name?: string) => void;
}) {
  const { isMobile, state } = useSidebar();
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [target, setTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);

  const handleRenameMarketplace = (item: Project) => {
    setTarget(item);
    setRenameOpen(true);
  };

  const handleAskDelete = (item: Project) => {
    setTarget(item);
    setDeleteOpen(true);
  };

  const doRename = async (newName: string) => {
    if (!target?.dbId) return;
    setIsRenaming(true);
    try {
      await renameMarketplaceAction({ id: target.dbId, newName });
      setRenameOpen(false);
      toast.success(`Marketplace renamed to "${newName}"`);
      router.refresh();
    } catch (e: any) {
      toast.error("Couldn’t rename", {
        description: e?.message ?? "Try again.",
      });
    } finally {
      setIsRenaming(false);
    }
  };

  const doDelete = async () => {
    if (!target) return;
    setIsDeleting(true);
    try {
      await deleteMarketplaceAction({
        id: target.dbId,
        marketplaceName: target.name,
      });
      onAfterDelete?.(target.dbId, target.name);
      setDeleteOpen(false);
      router.refresh();
    } finally {
      setIsDeleting(false);
      toast.success(`Marketplace "${target.name}" deleted`);
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
              <SidebarMenuItem key={item.connectionId} className="max-w-55">
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
                    <DropdownMenuItem
                      onClick={() => handleRenameMarketplace(item)}
                    >
                      <Pencil className="text-muted-foreground" />
                      <span>Rename Marketplace</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleAskDelete(item)}
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
      <RenameMarketplaceDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        marketplaceName={target?.name || target?.label || ""}
        existingNames={projects.map((p) => p.name)}
        onConfirm={doRename}
        isLoading={isRenaming}
      />
    </SidebarGroup>
  );
}
