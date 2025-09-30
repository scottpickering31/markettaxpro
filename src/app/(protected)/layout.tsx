import { requireUser } from "@/lib/auth";
import ProtectedLayoutClient from "@/components/local/protected-layout-client";
import type { SidebarUser } from "@/components/local/app-sidebar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  const sidebarUser: SidebarUser = {
    email: user.email!,
    name: (user.user_metadata?.full_name as string | undefined) ?? null,
    avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
  };

  return (
    <ProtectedLayoutClient sidebarUser={sidebarUser}>
      {children}
    </ProtectedLayoutClient>
  );
}
