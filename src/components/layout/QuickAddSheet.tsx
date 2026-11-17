"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Banknote, Camera, AlertTriangle, ListTodo, X } from "lucide-react";
import { ExpenseFormSheet } from "@/components/expense/ExpenseFormSheet";
import { JournalFormSheet } from "@/components/journal/JournalFormSheet";
import { TaskFormSheet } from "@/components/tasks/TaskFormSheet";

type Action = "expense" | "photo" | "issue" | "task" | null;

export function QuickAddSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [action, setAction] = useState<Action>(null);

  const openAction = (a: Action) => {
    onClose();
    setAction(a);
  };

  if (typeof document === "undefined") return null;

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-50 flex items-end justify-center">
              <motion.div
                className="absolute inset-0 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="relative z-10 w-full sm:max-w-md bg-surface rounded-t-3xl pb-[calc(env(safe-area-inset-bottom)+20px)] px-5 pt-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[17px] font-semibold">Thêm mới</h2>
                  <button
                    onClick={onClose}
                    aria-label="Đóng"
                    className="h-9 w-9 rounded-full flex items-center justify-center bg-surface-2"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <QuickOption
                    icon={Banknote}
                    label="Chi tiền"
                    onClick={() => openAction("expense")}
                  />
                  <QuickOption
                    icon={Camera}
                    label="Chụp ảnh"
                    onClick={() => openAction("photo")}
                  />
                  <QuickOption
                    icon={AlertTriangle}
                    label="Ghi sự cố"
                    onClick={() => openAction("issue")}
                  />
                  <QuickOption
                    icon={ListTodo}
                    label="Thêm việc"
                    onClick={() => openAction("task")}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

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

function QuickOption({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Banknote;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2.5 rounded-2xl bg-surface-2 border border-border py-6 active:scale-[0.97] transition-transform"
    >
      <div className="h-12 w-12 rounded-full bg-primary-light text-primary-dark flex items-center justify-center">
        <Icon size={22} />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
