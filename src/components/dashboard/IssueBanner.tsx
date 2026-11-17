import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";

export function IssueBanner({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <Link
      href="/journal"
      className="flex items-center gap-3 rounded-2xl bg-warning/10 border border-warning/20 px-4 py-3.5"
    >
      <div className="h-9 w-9 rounded-full bg-warning/20 text-warning flex items-center justify-center shrink-0">
        <AlertTriangle size={18} />
      </div>
      <p className="flex-1 text-sm font-medium text-text-primary">
        Bạn có {count} vấn đề cần xử lý
      </p>
      <ChevronRight size={18} className="text-text-secondary" />
    </Link>
  );
}
