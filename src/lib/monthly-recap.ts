import { AppState, JournalEntry } from "./types";
import { currentStage, monthlyExpenseTotals, overallProgress, totalPaid } from "./calculations";

export interface MonthlyRecap {
  monthLabel: string; // "Tháng 11/2026"
  totalSpent: number;
  expenseCount: number;
  biggestExpense?: { description: string; amount: number };
  spentVsLastMonth: number; // dương = chi nhiều hơn tháng trước, âm = ít hơn
  journalCount: number;
  newIssuesCount: number;
  resolvedIssuesCount: number;
  currentStageName?: string;
  overallProgress: number;
  totalPaidAllTime: number;
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function buildMonthlyRecap(state: AppState, reference: Date = new Date()): MonthlyRecap {
  const { stages, expenses, journal } = state;
  const key = monthKey(reference);

  const monthExpenses = expenses.filter((e) => e.date.slice(0, 7) === key);
  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const biggestExpense = monthExpenses.reduce<MonthlyRecap["biggestExpense"]>((acc, e) => {
    if (!acc || e.amount > acc.amount) return { description: e.description, amount: e.amount };
    return acc;
  }, undefined);

  const totals = monthlyExpenseTotals(expenses, 2);
  const spentVsLastMonth = totals.length === 2 ? totals[1].total - totals[0].total : 0;

  const monthJournal = journal.filter((j) => j.date.slice(0, 7) === key);

  let newIssuesCount = 0;
  let resolvedIssuesCount = 0;
  for (const entry of journal as JournalEntry[]) {
    for (const h of entry.issueHistory ?? []) {
      if (h.date.slice(0, 7) !== key) continue;
      if (h.status === "new") newIssuesCount += 1;
      if (h.status === "resolved") resolvedIssuesCount += 1;
    }
  }

  const stage = currentStage(stages);

  return {
    monthLabel: `Tháng ${reference.getMonth() + 1}/${reference.getFullYear()}`,
    totalSpent,
    expenseCount: monthExpenses.length,
    biggestExpense,
    spentVsLastMonth,
    journalCount: monthJournal.length,
    newIssuesCount,
    resolvedIssuesCount,
    currentStageName: stage?.name,
    overallProgress: overallProgress(stages),
    totalPaidAllTime: totalPaid(expenses),
  };
}
