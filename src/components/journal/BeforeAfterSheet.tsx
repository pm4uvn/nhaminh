"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/format";
import { JournalEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, Share2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { composeBeforeAfterImage, shareOrDownloadImage } from "@/lib/export-before-after";
import { notify } from "@/lib/toast";

export function BeforeAfterSheet({
  open,
  onClose,
  entries,
}: {
  open: boolean;
  onClose: () => void;
  entries: JournalEntry[];
}) {
  const homeName = useAppStore((s) => s.homeProfile?.name) ?? "Nhà của tôi";
  const [beforeId, setBeforeId] = useState<string | null>(null);
  const [afterId, setAfterId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const before = entries.find((e) => e.id === beforeId);
  const after = entries.find((e) => e.id === afterId);

  const handleShare = async () => {
    if (!before || !after || exporting) return;
    setExporting(true);
    try {
      const blob = await composeBeforeAfterImage(before, after, homeName);
      const result = await shareOrDownloadImage(blob, "truoc-va-sau.png");
      notify.success(result === "shared" ? "Đã chia sẻ!" : "Đã tải ảnh xuống, giờ bạn có thể chia sẻ");
    } catch {
      notify.error("Không tạo được ảnh, bạn thử lại nhé.");
    } finally {
      setExporting(false);
    }
  };

  const select = (id: string) => {
    if (beforeId === id) return setBeforeId(null);
    if (afterId === id) return setAfterId(null);
    if (!beforeId) return setBeforeId(id);
    if (!afterId) return setAfterId(id);
    setBeforeId(id);
    setAfterId(null);
  };

  return (
    <Sheet open={open} onClose={onClose} title="So sánh Trước & Sau">
      <div className="pt-1 space-y-5">
        {before && after ? (
          <div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <div className="h-36 rounded-xl overflow-hidden mb-1.5">
                  <PhotoPlaceholder seed={before.photoSeed} src={before.photoUrl} className="h-full w-full" />
                </div>
                <p className="text-xs font-medium text-center">Trước · {formatDate(before.date)}</p>
              </div>
              <div>
                <div className="h-36 rounded-xl overflow-hidden mb-1.5">
                  <PhotoPlaceholder seed={after.photoSeed} src={after.photoUrl} className="h-full w-full" />
                </div>
                <p className="text-xs font-medium text-center">Sau · {formatDate(after.date)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setBeforeId(null);
                  setAfterId(null);
                }}
              >
                Chọn lại ảnh khác
              </Button>
              <Button className="flex-1" disabled={exporting} onClick={handleShare}>
                <Share2 size={16} /> {exporting ? "Đang tạo ảnh..." : "Chia sẻ"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-text-secondary">
              Chọn 2 ảnh nhật ký để so sánh — một ảnh &quot;trước&quot; và một ảnh &quot;sau&quot;.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {entries.map((entry) => {
                const order = beforeId === entry.id ? 1 : afterId === entry.id ? 2 : null;
                return (
                  <button
                    key={entry.id}
                    onClick={() => select(entry.id)}
                    className="relative text-left"
                  >
                    <div
                      className={cn(
                        "h-28 rounded-xl overflow-hidden ring-2 ring-transparent",
                        order && "ring-primary"
                      )}
                    >
                      <PhotoPlaceholder seed={entry.photoSeed} src={entry.photoUrl} className="h-full w-full" />
                    </div>
                    {order && (
                      <div className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
                        {order === 1 ? <Check size={14} /> : order}
                      </div>
                    )}
                    <p className="text-xs text-text-secondary mt-1 truncate">
                      {formatDate(entry.date)}
                    </p>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}
