"use client";

import { useEffect, useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { FieldLabel, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { notify } from "@/lib/toast";

export function TaskFormSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addTask = useAppStore((s) => s.addTask);
  const [title, setTitle] = useState("");
  const [dueLabel, setDueLabel] = useState("");

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resets form fields each time the sheet opens
      setTitle("");
      setDueLabel("");
    }
  }, [open]);

  const canSave = title.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    addTask({ title, dueLabel: dueLabel || undefined });
    notify.success("Đã thêm việc cần làm");
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Thêm việc cần làm">
      <div className="space-y-5 pt-1">
        <div>
          <FieldLabel>Việc cần làm</FieldLabel>
          <Input
            autoFocus
            placeholder="Ví dụ: Xác nhận mẫu gạch"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel optional>Hạn hoàn thành</FieldLabel>
          <Input
            placeholder="Ví dụ: Hôm nay, 20/11/2026..."
            value={dueLabel}
            onChange={(e) => setDueLabel(e.target.value)}
          />
        </div>
        <Button className="w-full" size="lg" disabled={!canSave} onClick={handleSave}>
          Lưu việc cần làm
        </Button>
      </div>
    </Sheet>
  );
}
