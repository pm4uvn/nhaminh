"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  onBack,
  action,
}: {
  title: string;
  subtitle?: string;
  onBack?: boolean;
  action?: ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur px-5 pt-[calc(env(safe-area-inset-top)+16px)] pb-3 flex items-center gap-3">
      {onBack && (
        <button
          onClick={() => router.back()}
          aria-label="Quay lại"
          className="h-10 w-10 -ml-2 rounded-full flex items-center justify-center hover:bg-surface-2"
        >
          <ChevronLeft size={22} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-[22px] font-semibold leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
