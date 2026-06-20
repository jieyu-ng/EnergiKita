"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || (path !== "/" && pathname.startsWith(path));
    if (isActive) {
      return "text-[var(--color-ink)] border-b-2 border-[var(--color-accent)] h-full flex items-center px-1 -mb-[2px]";
    }
    return "hover:text-[var(--color-ink)] transition-colors h-full flex items-center border-b-2 border-transparent px-1 -mb-[2px]";
  };

  return (
    <div className="bg-[var(--color-paper)] border-b border-[var(--color-border)] sticky top-0 z-50">
      <nav className="max-w-[var(--page-width)] mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display font-bold text-[var(--color-ink)] flex items-center text-[var(--text-base)]">
            <img src="/logo.png" alt="EnergiKita Logo" className="h-8 w-auto mr-3 rounded" />
            EnergiKita
          </Link>

          <div className="hidden md:flex items-center gap-6 text-[var(--text-sm)] font-medium text-[var(--color-ink-2)] h-14">
            <Link href="/" className={getLinkClass("/")}>Home</Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
