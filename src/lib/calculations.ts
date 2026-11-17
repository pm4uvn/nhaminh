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

export function expenseCategoryTotal(
  expenses: Expense[],
  category: Expense["category"]
): number {
  return expenses
    .filter((e) => e.category === category)
    .reduce((sum, e) => sum + e.amount, 0);
}
