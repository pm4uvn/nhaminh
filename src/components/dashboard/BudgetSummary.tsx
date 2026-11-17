import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrencyCompact } from "@/lib/format";
import { Expense } from "@/lib/types";
import { budgetUtilization, remainingBudget, totalPaid } from "@/lib/calculations";

export function BudgetSummary({ budget, expenses }: { budget: number; expenses: Expense[] }) {
  const paid = totalPaid(expenses);
  const remaining = remainingBudget(budget, expenses);
  const utilization = budgetUtilization(budget, expenses);

  return (
    <Link href="/expenses" className="block">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Card className="p-4">
          <p className="text-xs font-medium text-text-secondary mb-1">Đã thanh toán</p>
          <p className="text-lg font-semibold tabular-nums">{formatCurrencyCompact(paid)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-text-secondary mb-1">Ngân sách còn lại</p>
          <p className="text-lg font-semibold tabular-nums text-success">
            {formatCurrencyCompact(remaining)}
          </p>
        </Card>
      </div>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-text-secondary">
            Tổng ngân sách {formatCurrencyCompact(budget)}
          </span>
          <span className="text-xs font-medium text-text-secondary">{utilization}%</span>
        </div>
        <ProgressBar
          value={utilization}
          barClassName={utilization >= 90 ? "bg-warning" : "bg-primary"}
        />
      </Card>
    </Link>
  );
}
