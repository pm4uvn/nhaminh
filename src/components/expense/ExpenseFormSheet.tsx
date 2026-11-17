"use client";

import { useEffect, useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { FieldLabel, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { EXPENSE_CATEGORIES } from "@/lib/meta";
import { useAppStore } from "@/lib/store";
import { Expense, ExpenseCategory } from "@/lib/types";
import { todayISO } from "@/lib/format";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Paperclip } from "lucide-react";

export function ExpenseFormSheet({
  open,
  onClose,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  editing?: Expense;
}) {
  const addExpense = useAppStore((s) => s.addExpense);
  const updateExpense = useAppStore((s) => s.updateExpense);

  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("khac");
  const [date, setDate] = useState(todayISO());
  const [attachmentName, setAttachmentName] = useState<string | undefined>();

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resets form fields each time the sheet opens
      setAmount(editing?.amount ?? 0);
      setDescription(editing?.description ?? "");
      setCategory(editing?.category ?? "khac");
      setDate(editing?.date ?? todayISO());
      setAttachmentName(editing?.attachmentName);
    }
  }, [open, editing]);

  const canSave = amount > 0 && description.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    if (editing) {
      updateExpense(editing.id, { amount, description, category, date, attachmentName });
      notify.success("Đã cập nhật khoản chi");
    } else {
      addExpense({ amount, description, category, date, attachmentName });
      notify.success("Đã lưu khoản chi mới");
    }
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={editing ? "Sửa khoản chi" : "Thêm khoản chi"}>
      <div className="space-y-5 pt-1">
        <div>
          <FieldLabel>Số tiền</FieldLabel>
          <CurrencyInput value={amount} onChange={setAmount} autoFocus />
        </div>

        <div>
          <FieldLabel>Mô tả</FieldLabel>
          <Input
            placeholder="Ví dụ: Gạch lát phòng khách"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <FieldLabel optional>Danh mục</FieldLabel>
          <div className="grid grid-cols-3 gap-2">
            {EXPENSE_CATEGORIES.map((c) => {
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

        <div>
          <FieldLabel optional>Ngày chi</FieldLabel>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <FieldLabel optional>Đính kèm hóa đơn</FieldLabel>
          <label className="flex items-center gap-2 h-12 rounded-2xl bg-surface-2 border border-dashed border-border px-4 text-sm text-text-secondary cursor-pointer">
            <Paperclip size={16} />
            <span className="truncate">{attachmentName ?? "Chọn ảnh hóa đơn (demo)"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setAttachmentName(e.target.files?.[0]?.name)}
            />
          </label>
        </div>

        <Button className="w-full" size="lg" disabled={!canSave} onClick={handleSave}>
          Lưu khoản chi
        </Button>
      </div>
    </Sheet>
  );
}
