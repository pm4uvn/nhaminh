"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ExpenseListItem } from "@/components/expense/ExpenseListItem";
import { ExpenseFormSheet } from "@/components/expense/ExpenseFormSheet";
import { ExpenseDetailSheet } from "@/components/expense/ExpenseDetailSheet";
import { BudgetPaceBanner } from "@/components/dashboard/BudgetPaceBanner";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/format";
import { budgetUtilization, remainingBudget, totalPaid } from "@/lib/calculations";
import { EXPENSE_CATEGORIES } from "@/lib/meta";
import { Expense, ExpenseCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Wallet } from "lucide-react";

export default function ExpensesPage() {
  const homeProfile = useAppStore((s) => s.homeProfile);
  const expenses = useAppStore((s) => s.expenses);
  const stages = useAppStore((s) => s.stages);

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "all">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | undefined>(undefined);
  const [detail, setDetail] = useState<Expense | null>(null);

  const budget = homeProfile?.budget ?? 0;
  const paid = totalPaid(expenses);
  const remaining = remainingBudget(budget, expenses);
  const utilization = budgetUtilization(budget, expenses);

  const filtered = useMemo(() => {
    return expenses
      .filter((e) => categoryFilter === "all" || e.category === categoryFilter)
      .filter((e) => e.description.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [expenses, categoryFilter, query]);

  return (
    <div className="pb-6">
      <PageHeader title="Chi phí xây nhà" />

      <div className="px-5 space-y-4">
        <Card className="p-4">
          <div className="grid grid-cols-3 gap-2 mb-3 text-center">
            <div>
              <p className="text-[11px] text-text-secondary mb-1">Ngân sách</p>
              <p className="text-sm font-semibold tabular-nums">{formatCurrency(budget)}</p>
            </div>
            <div>
              <p className="text-[11px] text-text-secondary mb-1">Đã thanh toán</p>
              <p className="text-sm font-semibold tabular-nums">{formatCurrency(paid)}</p>
            </div>
            <div>
              <p className="text-[11px] text-text-secondary mb-1">Còn lại</p>
              <p className="text-sm font-semibold tabular-nums text-success">
                {formatCurrency(remaining)}
              </p>
            </div>
          </div>
          <ProgressBar value={utilization} barClassName={utilization >= 90 ? "bg-warning" : "bg-primary"} />
        </Card>

        <BudgetPaceBanner stages={stages} budget={budget} expenses={expenses} />

        <Button className="w-full" size="lg" onClick={() => { setEditing(undefined); setFormOpen(true); }}>
          <Plus size={18} /> Thêm khoản chi
        </Button>

        <div className="relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm khoản chi..."
            className="w-full h-11 rounded-2xl bg-surface-2 border border-border pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
          <FilterChip
            active={categoryFilter === "all"}
            label="Tất cả"
            onClick={() => setCategoryFilter("all")}
          />
          {EXPENSE_CATEGORIES.map((c) => (
            <FilterChip
              key={c.value}
              active={categoryFilter === c.value}
              label={c.label}
              onClick={() => setCategoryFilter(c.value)}
            />
          ))}
        </div>

        <Card className="p-4">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="Chưa có khoản chi nào"
              description="Thêm khoản chi đầu tiên của bạn. Mọi khoản chi đều được lưu lại rõ ràng."
            />
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((e) => (
                <ExpenseListItem key={e.id} expense={e} onClick={() => setDetail(e)} />
              ))}
            </div>
          )}
        </Card>
      </div>

      <ExpenseFormSheet
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editing={editing}
      />
      <ExpenseDetailSheet
        expense={detail}
        onClose={() => setDetail(null)}
        onEdit={(e) => {
          setDetail(null);
          setEditing(e);
          setFormOpen(true);
        }}
      />
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors",
        active
          ? "bg-primary text-white border-primary"
          : "bg-surface text-text-secondary border-border"
      )}
    >
      {label}
    </button>
  );
}
