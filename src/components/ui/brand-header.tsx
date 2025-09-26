import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const BrandLogo = ({ className }: { className?: string }) => (
  <Image
    src="/logo-150x150.png"
    alt="Market Tax Pro"
    width={255}
    height={255}
    className={cn("rounded-sm", className)}
  />
);

export default function BrandHeader() {
  return (
    <div className="p-2">
      <Link
        href="/"
        className="flex h-12 items-center gap-2 rounded-md px-2 text-sm transition-colors
                 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
                 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0 "
      >
        <div className="flex size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
          <BrandLogo className="size-8" />
        </div>

        {/* Hide text when sidebar is collapsed to icons */}
        <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
          <span className="truncate font-medium">Market Tax Pro</span>
          <span className="truncate text-xs text-muted-foreground">Free</span>
        </div>
      </Link>
    </div>
  );
}
