"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { useAppStore } from "@/lib/store";
import { PaymentReminder } from "@/lib/payment-schedule";
import { getStageQuestions } from "@/lib/stage-questions";
import { formatCurrency } from "@/lib/format";
import { notify } from "@/lib/toast";
import { Check, HelpCircle } from "lucide-react";

export function PaymentReminderSheet({
  open,
  onClose,
  reminders,
}: {
  open: boolean;
  onClose: () => void;
  reminders: PaymentReminder[];
}) {
  const confirmStagePayment = useAppStore((s) => s.confirmStagePayment);
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState(0);

  return (
    <Sheet open={open} onClose={onClose} title="Nhắc thanh toán theo giai đoạn">
      <div className="pt-1 space-y-4">
        <p className="text-sm text-text-secondary leading-relaxed">
          Dựa trên lịch thanh toán phổ biến theo từng giai đoạn thi công — không phải ngày cố
          định — để bạn chủ động chuẩn bị, không bị thầu báo gấp.
        </p>

        <div className="space-y-3">
          {reminders.map((r) => {
            const topQuestions = getStageQuestions(r.stage.order).slice(0, 2);
            const isEditing = editingStageId === r.stage.id;
            return (
              <div key={r.stage.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="font-medium text-[15px]">{r.stage.name}</p>
                  <Badge tone={r.kind === "due" ? "warning" : "primary"}>
                    {r.kind === "due" ? "Đã hoàn thành" : "Sắp hoàn thành"}
                  </Badge>
                </div>
                <p className="text-sm text-text-secondary mb-2">{r.label}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-text-secondary">
                    Khoảng {r.percentage}% tổng ngân sách
                  </span>
                  <span className="text-[15px] font-semibold tabular-nums">
                    ~{formatCurrency(r.amount)}
                  </span>
                </div>

                {topQuestions.length > 0 && (
                  <div className="rounded-xl bg-terracotta/10 px-3 py-2.5 mb-3">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-terracotta mb-1.5">
                      <HelpCircle size={13} /> Nên hỏi thầu trước khi thanh toán
                    </p>
                    <ul className="space-y-1">
                      {topQuestions.map((q) => (
                        <li key={q.id} className="text-xs text-text-primary leading-relaxed">
                          • {q.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {isEditing ? (
                  <div className="space-y-2.5">
                    <CurrencyInput value={editAmount} onChange={setEditAmount} autoFocus />
                    <p className="text-xs text-text-secondary">
                      Nhập đúng số tiền thực tế đã trả — kể cả khi chỉ trả một phần. Khoản này sẽ
                      được cộng vào &quot;Đã thanh toán&quot;.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => setEditingStageId(null)}>
                        Hủy
                      </Button>
                      <Button
                        className="flex-1"
                        disabled={editAmount <= 0}
                        onClick={() => {
                          confirmStagePayment(r.stage.id, editAmount);
                          setEditingStageId(null);
                          notify.success("Đã ghi nhận khoản thanh toán này");
                        }}
                      >
                        <Check size={15} /> Xác nhận
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setEditingStageId(r.stage.id);
                      setEditAmount(r.amount);
                    }}
                  >
                    <Check size={15} /> Đã thanh toán đợt này
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          Số tiền gợi ý chỉ mang tính tham khảo dựa trên % tổng ngân sách — có thể khác với giá
          trị hợp đồng thực tế của bạn, nhất là khi ngân sách gồm cả các khoản tự mua (nội thất,
          vật liệu...). Hãy sửa lại đúng số tiền bạn thực trả trước khi xác nhận.
        </p>
      </div>
    </Sheet>
  );
}
