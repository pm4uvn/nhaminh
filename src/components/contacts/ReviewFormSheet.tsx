"use client";

import { useEffect, useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { FieldLabel, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { StarRating } from "./StarRating";
import { useAppStore } from "@/lib/store";
import { todayISO } from "@/lib/format";
import { notify } from "@/lib/toast";

export function ReviewFormSheet({
  open,
  onClose,
  contactId,
}: {
  open: boolean;
  onClose: () => void;
  contactId: string | null;
}) {
  const stages = useAppStore((s) => s.stages);
  const addContactReview = useAppStore((s) => s.addContactReview);

  const [rating, setRating] = useState(5);
  const [stageId, setStageId] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resets form fields each time the sheet opens
      setRating(5);
      setStageId("");
      setNote("");
    }
  }, [open]);

  const handleSave = () => {
    if (!contactId) return;
    addContactReview(contactId, {
      date: todayISO(),
      rating,
      stageId: stageId || undefined,
      note: note || undefined,
    });
    notify.success("Đã thêm đánh giá");
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Thêm đánh giá">
      <div className="space-y-5 pt-1">
        <div>
          <FieldLabel>Chấm điểm</FieldLabel>
          <StarRating rating={rating} onChange={setRating} size={32} className="gap-1.5" />
        </div>

        <div>
          <FieldLabel optional>Thuộc giai đoạn</FieldLabel>
          <select
            value={stageId}
            onChange={(e) => setStageId(e.target.value)}
            className="w-full h-12 rounded-2xl bg-surface-2 border border-border px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">Không chọn</option>
            {stages.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel optional>Ghi chú</FieldLabel>
          <Textarea
            placeholder="Nhận xét ngắn về chất lượng, thái độ, tiến độ..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <Button className="w-full" size="lg" onClick={handleSave}>
          Lưu đánh giá
        </Button>
      </div>
    </Sheet>
  );
}
