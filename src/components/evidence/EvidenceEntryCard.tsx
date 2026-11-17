import Link from "next/link";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function EvidenceEntryCard({ count }: { count: number }) {
  return (
    <Link href="/evidence">
      <Card className="p-4 flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-terracotta/15 text-terracotta flex items-center justify-center shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-medium">Trước khi che kín</p>
          <p className="text-xs text-text-secondary">
            {count > 0
              ? `${count} vị trí đã lưu lại — ống nước, dây điện...`
              : "Lưu ảnh vị trí trước khi tường/sàn bị che kín"}
          </p>
        </div>
        <ChevronRight size={18} className="text-text-secondary shrink-0" />
      </Card>
    </Link>
  );
}
