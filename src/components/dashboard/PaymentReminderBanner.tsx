"use client";

import { useState } from "react";
import { Wallet, ChevronRight } from "lucide-react";
import { getPaymentReminders } from "@/lib/payment-schedule";
import { Stage } from "@/lib/types";
import { PaymentReminderSheet } from "./PaymentReminderSheet";

export function PaymentReminderBanner({ stages, budget }: { stages: Stage[]; budget: number }) {
  const [open, setOpen] = useState(false);
  const reminders = getPaymentReminders(stages, budget);

  if (reminders.length === 0) return null;

  const top = reminders[0];
  const isDue = top.kind === "due";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 rounded-2xl border bg-primary-light border-primary/20 px-4 py-3.5 text-left"
      >
        <div className="h-9 w-9 rounded-full bg-primary/15 text-primary-dark flex items-center justify-center shrink-0">
          <Wallet size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary-dark leading-snug">
            {isDue
              ? `Giai đoạn "${top.stage.name}" đã xong — có thể cần thanh toán đợt tiếp theo`
              : `Giai đoạn "${top.stage.name}" sắp xong — chuẩn bị cho đợt thanh toán tiếp theo`}
          </p>
          {reminders.length > 1 && (
            <p className="text-xs text-primary-dark/70 mt-0.5">
              và {reminders.length - 1} nhắc nhở khác
            </p>
          )}
        </div>
        <ChevronRight size={18} className="text-primary-dark/60 shrink-0" />
      </button>

      <PaymentReminderSheet open={open} onClose={() => setOpen(false)} reminders={reminders} />
    </>
  );
}
