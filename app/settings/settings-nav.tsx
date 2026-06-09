"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Integrations", href: "/settings/integrations" },
  { label: "Keys / Secrets", href: "/settings/keys" },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "border-l-2 border-accent bg-surface-muted px-3 py-2 text-sm font-medium text-foreground"
                : "border-l-2 border-transparent px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
