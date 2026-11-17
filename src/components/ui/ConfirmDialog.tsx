"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  danger = true,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="relative z-10 w-full max-w-sm bg-surface rounded-3xl p-5 shadow-xl"
          >
            <div
              className={
                "h-11 w-11 rounded-full flex items-center justify-center mb-3 " +
                (danger ? "bg-danger/10 text-danger" : "bg-primary-light text-primary-dark")
              }
            >
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-[17px] font-semibold mb-1">{title}</h3>
            {description && (
              <p className="text-sm text-text-secondary mb-4">{description}</p>
            )}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1" onClick={onCancel}>
                {cancelLabel}
              </Button>
              <Button
                variant={danger ? "danger" : "primary"}
                className="flex-1"
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
