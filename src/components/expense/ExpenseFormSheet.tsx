"use client";

import { useEffect, useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { FieldLabel, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { EXPENSE_CATEGORIES } from "@/lib/meta";
import { useAppStore } from "@/lib/store";
import { useGeminiKeyStore } from "@/lib/gemini-key-store";
import { Expense, ExpenseCategory } from "@/lib/types";
import { todayISO } from "@/lib/format";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Paperclip, ScanLine } from "lucide-react";

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
  const geminiApiKey = useGeminiKeyStore((s) => s.apiKey);

  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("khac");
  const [date, setDate] = useState(todayISO());
  const [attachmentName, setAttachmentName] = useState<string | undefined>();
  const [scanning, setScanning] = useState(false);

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

  const scanReceipt = async (file: File) => {
    setAttachmentName(file.name);
    setScanning(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const [, base64] = dataUrl.split(",");
      const res = await fetch("/api/ocr-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType: file.type, apiKey: geminiApiKey }),
      });
      const data = await res.json();
      if (data.ok && typeof data.amount === "number") {
        setAmount((prev) => (prev > 0 ? prev : data.amount));
        if (data.description) {
          setDescription((prev) => (prev.trim() ? prev : data.description));
        }
        notify.success("Đã tự động nhận diện số tiền từ hóa đơn — kiểm tra lại trước khi lưu nhé");
      } else if (data.message) {
        notify.info(data.message);
      }
    } catch {
      notify.info("Không nhận diện được hóa đơn, bạn nhập tay giúp nhé.");
    } finally {
      setScanning(false);
    }
  };

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
            {scanning ? <ScanLine size={16} className="animate-pulse text-primary" /> : <Paperclip size={16} />}
            <span className="truncate">
              {scanning
                ? "Đang nhận diện số tiền từ ảnh..."
                : (attachmentName ?? "Chụp hoặc chọn ảnh hóa đơn")}
            </span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              disabled={scanning}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) scanReceipt(file);
              }}
            />
          </label>
          <p className="text-xs text-text-secondary mt-1.5">
            Chụp hóa đơn, ứng dụng sẽ thử tự điền số tiền giúp bạn.
          </p>
        </div>

        <Button className="w-full" size="lg" disabled={!canSave} onClick={handleSave}>
          Lưu khoản chi
        </Button>
      </div>
    </Sheet>
  );
}
