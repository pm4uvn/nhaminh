"use client";

import { useState } from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { budgetPace } from "@/lib/calculations";
import { Expense, Stage } from "@/lib/types";
import { BudgetPaceDetailSheet } from "./BudgetPaceDetailSheet";

export function BudgetPaceBanner({
  stages,
  budget,
  expenses,
}: {
  stages: Stage[];
  budget: number;
  expenses: Expense[];
}) {
  const [open, setOpen] = useState(false);
  const pace = budgetPace(stages, budget, expenses);

  if (pace.level === "ok" || pace.level === "insufficient_data") return null;

  const isOverBudget = pace.level === "over_budget";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          "w-full flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left " +
          (isOverBudget
            ? "bg-danger/10 border-danger/20"
            : "bg-warning/10 border-warning/20")
        }
      >
        <div
          className={
            "h-9 w-9 rounded-full flex items-center justify-center shrink-0 " +
            (isOverBudget ? "bg-danger/20 text-danger" : "bg-warning/20 text-warning")
          }
        >
          <AlertTriangle size={18} />
        </div>
        <p className="flex-1 text-sm font-medium text-text-primary leading-snug">
          {isOverBudget
            ? "Chi phí đã vượt ngân sách dự kiến"
            : "Bạn đang chi nhanh hơn tốc độ xây — có thể vượt ngân sách"}
        </p>
        <ChevronRight size={18} className="text-text-secondary shrink-0" />
      </button>

      <BudgetPaceDetailSheet open={open} onClose={() => setOpen(false)} pace={pace} budget={budget} />
    </>
  );
}
