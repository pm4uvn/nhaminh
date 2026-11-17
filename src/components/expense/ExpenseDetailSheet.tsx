"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Badge } from "@/components/ui/Badge";
import { expenseCategoryMeta } from "@/lib/meta";
import { formatCurrency, formatDate } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { Expense } from "@/lib/types";
import { notify } from "@/lib/toast";
import { Paperclip, Pencil, Trash2 } from "lucide-react";

export function ExpenseDetailSheet({
  expense,
  onClose,
  onEdit,
}: {
  expense: Expense | null;
  onClose: () => void;
  onEdit: (expense: Expense) => void;
}) {
  const deleteExpense = useAppStore((s) => s.deleteExpense);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!expense) return null;
  const meta = expenseCategoryMeta(expense.category);
  const Icon = meta.icon;

  return (
    <>
      <Sheet open={!!expense} onClose={onClose} title="Chi tiết khoản chi">
        <div className="pt-1">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-12 w-12 rounded-2xl bg-primary-light text-primary-dark flex items-center justify-center">
              <Icon size={22} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[16px] truncate">{expense.description}</p>
              <Badge tone="primary">{meta.label}</Badge>
            </div>
          </div>

          <div className="rounded-2xl bg-surface-2 p-4 mb-4">
            <p className="text-xs text-text-secondary mb-1">Số tiền</p>
            <p className="text-2xl font-bold tabular-nums">{formatCurrency(expense.amount)}</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Ngày chi</span>
              <span className="font-medium">{formatDate(expense.date)}</span>
            </div>
            {expense.attachmentName && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Đính kèm</span>
                <span className="font-medium flex items-center gap-1.5">
                  <Paperclip size={14} />
                  {expense.attachmentName}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onEdit(expense)}>
              <Pencil size={16} /> Sửa
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={16} /> Xóa
            </Button>
          </div>
        </div>
      </Sheet>

      <ConfirmDialog
        open={confirmDelete}
        title="Xóa khoản chi này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteExpense(expense.id);
          setConfirmDelete(false);
          onClose();
          notify.success("Đã xóa khoản chi");
        }}
      />
    </>
  );
}
