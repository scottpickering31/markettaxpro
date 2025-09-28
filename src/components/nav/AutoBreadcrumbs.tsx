// components/nav/AutoBreadcrumbs.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Route } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Optional: pretty names for specific segments (ids, slugs, etc.)
type LabelMap = Record<string, string>;

function titleize(segment: string) {
  // decode %20, split hyphens, capitalise words: "data-fetching" -> "Data Fetching"
  return decodeURIComponent(segment)
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export default function AutoBreadcrumbs({
  labelMap = {},
  hideRoot = false,
}: {
  labelMap?: LabelMap;
  hideRoot?: boolean;
}) {
  const pathname = usePathname() || "/";
  // e.g. "/transactions/123/edit" -> ["transactions","123","edit"]
  const segments = pathname.split("/").filter(Boolean);

  // Build cumulative hrefs so each crumb links to its level
  const items = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = labelMap[seg] ?? titleize(seg);
    const isLast = i === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {!hideRoot && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {items.length > 0 && <BreadcrumbSeparator />}
          </>
        )}

        {items.map((item, idx) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href as Route}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {idx < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
