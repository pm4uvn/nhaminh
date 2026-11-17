"use client";

import { Card } from "@/components/ui/Card";
import { Task } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function TaskListCard({ tasks }: { tasks: Task[] }) {
  const toggleTask = useAppStore((s) => s.toggleTask);
  const pending = tasks.filter((t) => !t.done).slice(0, 3);
  const allDone = tasks.length > 0 && pending.length === 0;

  return (
    <Card className="p-4">
      <h2 className="text-[15px] font-semibold mb-3">Việc cần làm</h2>
      {allDone ? (
        <p className="text-sm text-text-secondary py-2">
          Bạn đã hoàn thành tất cả việc cần làm! 🎉
        </p>
      ) : pending.length === 0 ? (
        <p className="text-sm text-text-secondary py-2">Chưa có việc cần làm nào.</p>
      ) : (
        <ul className="space-y-2.5">
          {pending.map((t) => (
            <li key={t.id} className="flex items-center gap-3">
              <button
                onClick={() => toggleTask(t.id)}
                aria-label="Hoàn thành"
                className={cn(
                  "h-6 w-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors",
                  t.done ? "bg-success border-success text-white" : "border-border"
                )}
              >
                {t.done && <Check size={14} />}
              </button>
              <span className="flex-1 text-sm font-medium truncate">{t.title}</span>
              {t.dueLabel && (
                <span className="text-xs text-text-secondary shrink-0">{t.dueLabel}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
