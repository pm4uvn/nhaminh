import { Expense, Stage } from "./types";

export function totalPaid(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function remainingBudget(budget: number, expenses: Expense[]): number {
  return budget - totalPaid(expenses);
}

export function budgetUtilization(budget: number, expenses: Expense[]): number {
  if (budget <= 0) return 0;
  return Math.min(100, Math.round((totalPaid(expenses) / budget) * 100));
}

export function overallProgress(stages: Stage[]): number {
  const total = stages.reduce((sum, s) => sum + s.checklist.length, 0);
  if (total === 0) return 0;
  const done = stages.reduce(
    (sum, s) => sum + s.checklist.filter((c) => c.done).length,
    0
  );
  return Math.round((done / total) * 100);
}

export function completedStagesCount(stages: Stage[]): number {
  return stages.filter((s) => s.status === "done").length;
}

export function currentStage(stages: Stage[]): Stage | undefined {
  return (
    stages.find((s) => s.status === "doing") ??
    stages.slice().reverse().find((s) => s.status === "done")
  );
}

export function stageProgress(stage: Stage): number {
  if (stage.checklist.length === 0) return stage.status === "done" ? 100 : 0;
  const done = stage.checklist.filter((c) => c.done).length;
  return Math.round((done / stage.checklist.length) * 100);
}

export type CompletionEstimateStatus = "ok" | "insufficient_data" | "completed";

export interface CompletionEstimate {
  status: CompletionEstimateStatus;
  weeksRemaining?: number;
  estimatedDate?: string; // ISO date
}

/**
 * Ước tính ngày hoàn thành dựa trên tốc độ tiến độ trung bình từ ngày bắt đầu
 * tới hiện tại, ngoại suy tới 100%. Không dựa trên lịch sử ngày của từng mốc
 * (dữ liệu demo không lưu), nên cần ít nhất 7 ngày trôi qua và 3% tiến độ để
 * tránh ngoại suy sai lệch khi vừa mới bắt đầu.
 */
export function estimateCompletion(stages: Stage[], startDate?: string): CompletionEstimate {
  const progress = overallProgress(stages);
  if (progress >= 100) return { status: "completed" };
  if (!startDate) return { status: "insufficient_data" };

  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return { status: "insufficient_data" };

  const daysElapsed = Math.floor((Date.now() - start.getTime()) / 86_400_000);
  if (daysElapsed < 7 || progress < 3) return { status: "insufficient_data" };

  const pacePerDay = progress / daysElapsed;
  const remainingDays = Math.round((100 - progress) / pacePerDay);
  const weeksRemaining = Math.max(1, Math.round(remainingDays / 7));
  const estimatedDate = new Date(Date.now() + remainingDays * 86_400_000)
    .toISOString()
    .slice(0, 10);

  return { status: "ok", weeksRemaining, estimatedDate };
}

export function expenseCategoryTotal(
  expenses: Expense[],
  category: Expense["category"]
): number {
  return expenses
    .filter((e) => e.category === category)
    .reduce((sum, e) => sum + e.amount, 0);
}
