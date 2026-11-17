"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className={cn(
              "relative z-10 w-full sm:max-w-md bg-surface rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col pb-[env(safe-area-inset-bottom)]",
              className
            )}
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="mx-auto sm:hidden absolute left-1/2 -translate-x-1/2 top-2 h-1.5 w-10 rounded-full bg-border" />
              <h2 className="text-[17px] font-semibold pt-2 sm:pt-0">{title}</h2>
              <button
                onClick={onClose}
                aria-label="Đóng"
                className="h-9 w-9 rounded-full flex items-center justify-center bg-surface-2 hover:bg-border transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto px-5 pb-6 flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
