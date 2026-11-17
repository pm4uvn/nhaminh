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

export type BudgetPaceLevel = "ok" | "insufficient_data" | "ahead_spending" | "over_budget";

export interface BudgetPace {
  level: BudgetPaceLevel;
  progress: number; // % tiến độ thi công
  spentPercent: number; // % ngân sách đã chi, không giới hạn ở 100 (để phát hiện vượt)
  gap: number; // spentPercent - progress, điểm phần trăm
  projectedTotal?: number; // tổng chi phí ước tính nếu giữ nguyên tốc độ tới khi hoàn thành
  projectedOverrun?: number; // projectedTotal - budget (âm nghĩa là vẫn trong ngân sách)
}

const AHEAD_GAP_THRESHOLD = 15; // điểm phần trăm
const PROJECTED_OVERRUN_THRESHOLD_RATIO = 0.05; // 5% ngân sách

/**
 * So sánh % ngân sách đã chi với % tiến độ thi công để phát hiện sớm nguy cơ
 * vượt ngân sách. Cần tiến độ tối thiểu 5% để tránh báo động giả ở giai đoạn
 * đầu, khi các khoản cọc (đất, vật liệu, nội thất...) thường được trả trước
 * khi tiến độ thi công vật lý chưa thể hiện rõ.
 */
export function budgetPace(stages: Stage[], budget: number, expenses: Expense[]): BudgetPace {
  const progress = overallProgress(stages);
  const paid = totalPaid(expenses);

  if (budget <= 0) {
    return { level: "insufficient_data", progress, spentPercent: 0, gap: 0 };
  }

  const spentPercent = (paid / budget) * 100;

  if (progress < 5) {
    return {
      level: "insufficient_data",
      progress,
      spentPercent,
      gap: spentPercent - progress,
    };
  }

  const projectedTotal = paid / (progress / 100);
  const projectedOverrun = projectedTotal - budget;
  const gap = spentPercent - progress;

  if (spentPercent >= 100) {
    return { level: "over_budget", progress, spentPercent, gap, projectedTotal, projectedOverrun };
  }
  if (gap >= AHEAD_GAP_THRESHOLD || projectedOverrun > budget * PROJECTED_OVERRUN_THRESHOLD_RATIO) {
    return {
      level: "ahead_spending",
      progress,
      spentPercent,
      gap,
      projectedTotal,
      projectedOverrun,
    };
  }
  return { level: "ok", progress, spentPercent, gap, projectedTotal, projectedOverrun };
}

export interface MonthlyTotal {
  month: string; // "YYYY-MM"
  label: string; // "Tháng 11/2026"
  total: number;
}

/**
 * Tổng chi phí theo từng tháng dương lịch (dựa vào `expense.date`), tính lùi
 * từ tháng hiện tại, dùng để so sánh "tháng này chi nhiều hơn tháng trước
 * không".
 */
export function monthlyExpenseTotals(expenses: Expense[], monthsBack = 3): MonthlyTotal[] {
  const now = new Date();
  const result: MonthlyTotal[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const total = expenses
      .filter((e) => e.date.slice(0, 7) === month)
      .reduce((sum, e) => sum + e.amount, 0);
    result.push({ month, label: `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`, total });
  }
  return result;
}

export function expenseCategoryTotal(
  expenses: Expense[],
  category: Expense["category"]
): number {
  return expenses
    .filter((e) => e.category === category)
    .reduce((sum, e) => sum + e.amount, 0);
}
