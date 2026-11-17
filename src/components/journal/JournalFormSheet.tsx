"use client";

import { useEffect, useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { FieldLabel, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ImagePicker } from "@/components/ui/ImagePicker";
import { JOURNAL_TYPES } from "@/lib/meta";
import { useAppStore } from "@/lib/store";
import { JournalEntryType } from "@/lib/types";
import { todayISO } from "@/lib/format";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";

export function JournalFormSheet({
  open,
  onClose,
  defaultIssue = false,
}: {
  open: boolean;
  onClose: () => void;
  defaultIssue?: boolean;
}) {
  const addJournalEntry = useAppStore((s) => s.addJournalEntry);
  const stages = useAppStore((s) => s.stages);

  const [caption, setCaption] = useState("");
  const [type, setType] = useState<JournalEntryType>(defaultIssue ? "issue" : "update");
  const [stageId, setStageId] = useState<string>("");
  const [area, setArea] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resets form fields each time the sheet opens
      setCaption("");
      setType(defaultIssue ? "issue" : "update");
      setStageId("");
      setArea("");
      setPhoto(undefined);
    }
  }, [open, defaultIssue]);

  const canSave = caption.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const isIssue = type === "issue";
    addJournalEntry({
      date: todayISO(),
      caption,
      type,
      stageId: stageId || undefined,
      area: area || undefined,
      photoUrl: photo,
      photoSeed: photo ? undefined : caption,
      isIssue,
      issueStatus: isIssue ? "new" : undefined,
      issueHistory: isIssue
        ? [{ date: todayISO(), status: "new", note: "Mới ghi nhận" }]
        : undefined,
    });
    notify.success(isIssue ? "Đã ghi nhận sự cố" : "Đã thêm nhật ký mới");
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={defaultIssue ? "Ghi sự cố" : "Thêm nhật ký"}>
      <div className="space-y-5 pt-1">
        <ImagePicker value={photo} onChange={setPhoto} label="Chụp hoặc chọn ảnh" />

        <div>
          <FieldLabel>Mô tả</FieldLabel>
          <Textarea
            placeholder={defaultIssue ? "Mô tả sự cố gặp phải..." : "Hôm nay nhà có gì mới?"}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        <div>
          <FieldLabel optional>Loại ghi chú</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {JOURNAL_TYPES.map((t) => {
              const Icon = t.icon;
              const active = type === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={cn(
                    "flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-primary-light text-primary-dark"
                      : "border-border bg-surface-2 text-text-secondary"
                  )}
                >
                  <Icon size={16} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <FieldLabel optional>Khu vực</FieldLabel>
          <Input
            placeholder="Ví dụ: Phòng khách, sân thượng..."
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
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

        <Button className="w-full" size="lg" disabled={!canSave} onClick={handleSave}>
          {defaultIssue ? "Lưu sự cố" : "Lưu nhật ký"}
        </Button>
      </div>
    </Sheet>
  );
}
