import { Stage } from "./types";
import { stageProgress } from "./calculations";

/**
 * Lịch thanh toán tham khảo theo giai đoạn (phổ biến với nhà xây mới ở Việt
 * Nam), gắn với `stage.order` — không gắn với ngày cụ thể. Tổng 100%.
 */
export const PAYMENT_SCHEDULE: Record<number, { percentage: number; label: string }> = {
  1: { percentage: 10, label: "Đặt cọc & ký hợp đồng" },
  2: { percentage: 20, label: "Sau khi hoàn thành phần móng" },
  3: { percentage: 30, label: "Sau khi hoàn thành phần thô" },
  4: { percentage: 15, label: "Sau khi hoàn thành điện nước" },
  5: { percentage: 20, label: "Sau khi hoàn thiện nội ngoại thất" },
  6: { percentage: 5, label: "Khi bàn giao nhà" },
};

export type PaymentReminderKind = "due" | "upcoming";

export interface PaymentReminder {
  stage: Stage;
  kind: PaymentReminderKind;
  percentage: number;
  amount: number;
  label: string;
}

const UPCOMING_THRESHOLD = 70; // % checklist của giai đoạn, coi là "sắp xong"

export function getPaymentReminders(stages: Stage[], budget: number): PaymentReminder[] {
  const reminders: PaymentReminder[] = [];

  for (const stage of stages) {
    if (stage.paymentConfirmed) continue;
    const schedule = PAYMENT_SCHEDULE[stage.order];
    if (!schedule) continue;

    let kind: PaymentReminderKind | null = null;
    if (stage.status === "done") {
      kind = "due";
    } else if (stage.status === "doing" && stageProgress(stage) >= UPCOMING_THRESHOLD) {
      kind = "upcoming";
    }
    if (!kind) continue;

    reminders.push({
      stage,
      kind,
      percentage: schedule.percentage,
      amount: Math.round((budget * schedule.percentage) / 100),
      label: schedule.label,
    });
  }

  return reminders.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "due" ? -1 : 1;
    return a.stage.order - b.stage.order;
  });
}
