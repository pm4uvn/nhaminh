"use client";

import { useEffect, useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { FieldLabel, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { DOCUMENT_CATEGORIES } from "@/lib/meta";
import { useAppStore } from "@/lib/store";
import { DocumentCategory } from "@/lib/types";
import { todayISO } from "@/lib/format";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

export function DocumentFormSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addDocument = useAppStore((s) => s.addDocument);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("khac");

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resets form fields each time the sheet opens
      setName("");
      setCategory("khac");
    }
  }, [open]);

  const canSave = name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    addDocument({ name, category, addedDate: todayISO() });
    notify.success("Đã thêm tài liệu");
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Thêm tài liệu">
      <div className="space-y-5 pt-1">
        <label className="flex items-center gap-2 h-14 rounded-2xl bg-surface-2 border border-dashed border-border px-4 text-sm text-text-secondary cursor-pointer">
          <Upload size={18} />
          <span className="truncate">{name || "Chọn file từ máy (demo)"}</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setName(f.name);
            }}
          />
        </label>

        <div>
          <FieldLabel>Tên tài liệu</FieldLabel>
          <Input
            placeholder="Ví dụ: Hợp đồng thi công.pdf"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <FieldLabel optional>Danh mục</FieldLabel>
          <div className="grid grid-cols-3 gap-2">
            {DOCUMENT_CATEGORIES.map((c) => {
              const Icon = c.icon;
              const active = category === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-xs font-medium transition-colors",
                    active
                      ? "border-primary bg-primary-light text-primary-dark"
                      : "border-border bg-surface-2 text-text-secondary"
                  )}
                >
                  <Icon size={18} />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <Button className="w-full" size="lg" disabled={!canSave} onClick={handleSave}>
          Lưu tài liệu
        </Button>
      </div>
    </Sheet>
  );
}
