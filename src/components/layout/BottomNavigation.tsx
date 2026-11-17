"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, GanttChartSquare, BookOpen, FolderOpen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { QuickAddSheet } from "./QuickAddSheet";

const TABS = [
  { href: "/home", label: "Hôm nay", icon: Home },
  { href: "/expenses", label: "Chi phí", icon: Wallet },
  { href: "/progress", label: "Tiến độ", icon: GanttChartSquare },
  { href: "/journal", label: "Nhật ký", icon: BookOpen },
  { href: "/profile", label: "Hồ sơ", icon: FolderOpen },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur border-t border-border pb-[env(safe-area-inset-bottom)]"
        aria-label="Điều hướng chính"
      >
        <div className="mx-auto max-w-md relative flex items-stretch justify-between px-2">
          {TABS.slice(0, 2).map((tab) => (
            <TabLink key={tab.href} tab={tab} active={pathname.startsWith(tab.href)} />
          ))}

          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={() => setQuickAddOpen(true)}
              aria-label="Thêm mới"
              className="relative -top-5 h-14 w-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center active:scale-95 transition-transform"
            >
              <Plus size={26} />
            </button>
          </div>

          {TABS.slice(2).map((tab) => (
            <TabLink key={tab.href} tab={tab} active={pathname.startsWith(tab.href)} />
          ))}
        </div>
      </nav>

      <QuickAddSheet open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
    </>
  );
}

function TabLink({
  tab,
  active,
}: {
  tab: { href: string; label: string; icon: typeof Home };
  active: boolean;
}) {
  const Icon = tab.icon;
  return (
    <Link
      href={tab.href}
      className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-w-0"
    >
      <Icon
        size={22}
        strokeWidth={active ? 2.3 : 1.8}
        className={cn(active ? "text-primary" : "text-text-secondary")}
      />
      <span
        className={cn(
          "text-[11px] font-medium truncate",
          active ? "text-primary" : "text-text-secondary"
        )}
      >
        {tab.label}
      </span>
    </Link>
  );
}
