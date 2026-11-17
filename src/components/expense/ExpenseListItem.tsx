import { expenseCategoryMeta } from "@/lib/meta";
import { formatCurrency, formatDate } from "@/lib/format";
import { Expense } from "@/lib/types";

export function ExpenseListItem({
  expense,
  onClick,
}: {
  expense: Expense;
  onClick: () => void;
}) {
  const meta = expenseCategoryMeta(expense.category);
  const Icon = meta.icon;
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 text-left active:bg-surface-2 rounded-xl px-1 -mx-1 transition-colors"
    >
      <div className="h-11 w-11 rounded-2xl bg-primary-light text-primary-dark flex items-center justify-center shrink-0">
        <Icon size={19} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium truncate">{expense.description}</p>
        <p className="text-xs text-text-secondary mt-0.5">{formatDate(expense.date)}</p>
      </div>
      <p className="text-[15px] font-semibold tabular-nums shrink-0">
        {formatCurrency(expense.amount)}
      </p>
    </button>
  );
}
