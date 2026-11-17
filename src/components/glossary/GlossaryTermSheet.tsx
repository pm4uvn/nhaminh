"use client";

import { Sheet } from "@/components/ui/Sheet";
import { useGlossaryUi } from "@/lib/glossary-store";
import { getGlossaryTerm } from "@/lib/glossary";
import { seedGradient } from "@/lib/utils";
import { BookOpenText } from "lucide-react";

export function GlossaryTermSheet() {
  const openTermId = useGlossaryUi((s) => s.openTermId);
  const close = useGlossaryUi((s) => s.close);
  const term = openTermId ? getGlossaryTerm(openTermId) : undefined;

  if (!openTermId) return null;
  if (!term) return null;

  const Icon = term.icon;

  return (
    <Sheet open={!!openTermId} onClose={close} title="Giải thích thuật ngữ">
      <div className="pt-1 space-y-4">
        <div
          className="h-32 rounded-2xl flex items-center justify-center text-white"
          style={{ background: seedGradient(term.id) }}
        >
          <Icon size={44} strokeWidth={1.6} />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <BookOpenText size={16} className="text-primary" />
            <h3 className="text-[17px] font-semibold">{term.label}</h3>
          </div>
          <p className="text-[15px] text-text-primary leading-relaxed">{term.definition}</p>
        </div>

        {term.example && (
          <div className="rounded-2xl bg-surface-2 px-4 py-3">
            <p className="text-xs font-medium text-text-secondary mb-1">Ví dụ</p>
            <p className="text-sm text-text-primary">{term.example}</p>
          </div>
        )}
      </div>
    </Sheet>
  );
}
