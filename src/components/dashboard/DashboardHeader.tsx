"use client";

import Link from "next/link";
import { Bell, Settings } from "lucide-react";
import { timeGreeting } from "@/lib/format";
import { notify } from "@/lib/toast";

export function DashboardHeader({ homeName }: { homeName: string }) {
  return (
    <div className="px-5 pt-[calc(env(safe-area-inset-top)+16px)] pb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[20px] font-semibold leading-tight">{timeGreeting()}</p>
        <p className="text-sm text-text-secondary mt-0.5 truncate">
          {homeName} của bạn hôm nay thế nào?
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          aria-label="Thông báo"
          onClick={() => notify.info("Bạn chưa có thông báo mới")}
          className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center"
        >
          <Bell size={18} />
        </button>
        <Link
          href="/settings"
          aria-label="Cài đặt"
          className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center"
        >
          <Settings size={18} />
        </Link>
      </div>
    </div>
  );
}
