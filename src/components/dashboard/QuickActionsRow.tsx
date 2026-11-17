"use client";

import { useState } from "react";
import { Banknote, Camera, AlertTriangle, ListTodo } from "lucide-react";
import { ExpenseFormSheet } from "@/components/expense/ExpenseFormSheet";
import { JournalFormSheet } from "@/components/journal/JournalFormSheet";
import { TaskFormSheet } from "@/components/tasks/TaskFormSheet";

type Action = "expense" | "photo" | "issue" | "task" | null;

export function QuickActionsRow() {
  const [action, setAction] = useState<Action>(null);

  const items: { key: Exclude<Action, null>; label: string; icon: typeof Banknote }[] = [
    { key: "expense", label: "Thêm chi phí", icon: Banknote },
    { key: "photo", label: "Chụp ảnh", icon: Camera },
    { key: "issue", label: "Ghi sự cố", icon: AlertTriangle },
    { key: "task", label: "Thêm việc", icon: ListTodo },
  ];

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setAction(item.key)}
              className="flex flex-col items-center gap-1.5 py-2 active:scale-95 transition-transform"
            >
              <div className="h-11 w-11 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary">
                <Icon size={19} />
              </div>
              <span className="text-[11px] font-medium text-text-secondary text-center leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <ExpenseFormSheet open={action === "expense"} onClose={() => setAction(null)} />
      <JournalFormSheet
        open={action === "photo" || action === "issue"}
        onClose={() => setAction(null)}
        defaultIssue={action === "issue"}
      />
      <TaskFormSheet open={action === "task"} onClose={() => setAction(null)} />
    </>
  );
}
