import { requireUser } from "@/lib/auth";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/local/app-sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Separator } from "@/components/ui/separator";
import AutoBreadcrumbs from "@/components/nav/AutoBreadcrumbs";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  const sidebarUser = {
    id: user.id,
    email: user.email!,
    name: (user.user_metadata?.full_name as string | undefined) ?? null,
    avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
  };

  return (
    <SidebarProvider>
      <AppSidebar user={sidebarUser} />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <ModeToggle />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <AutoBreadcrumbs
              // Optional overrides for segments/ids
              labelMap={{
                // e.g. map known sections or dynamic slugs to friendly names
                transactions: "Transactions",
                costs: "Costs",
                "csv-export": "CSV Export",
                "pdf-export": "PDF Export",
                // '123': 'Order #123', // example for a dynamic id
              }}
            />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 px-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
