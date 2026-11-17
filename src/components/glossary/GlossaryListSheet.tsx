"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { GLOSSARY } from "@/lib/glossary";
import { useGlossaryUi } from "@/lib/glossary-store";
import { seedGradient } from "@/lib/utils";
import { Search } from "lucide-react";

export function GlossaryListSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const openTerm = useGlossaryUi((s) => s.openTerm);
  const [query, setQuery] = useState("");

  const filtered = GLOSSARY.filter((t) =>
    t.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Sheet open={open} onClose={onClose} title="Từ điển xây nhà">
      <div className="pt-1 space-y-4">
        <p className="text-sm text-text-secondary">
          Giải nghĩa các thuật ngữ xây dựng thường gặp bằng ngôn ngữ dễ hiểu.
        </p>
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm thuật ngữ..."
            className="w-full h-11 rounded-2xl bg-surface-2 border border-border pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="divide-y divide-border">
          {filtered.map((term) => {
            const Icon = term.icon;
            return (
              <button
                key={term.id}
                onClick={() => {
                  onClose();
                  openTerm(term.id);
                }}
                className="w-full flex items-center gap-3 py-3 text-left"
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{ background: seedGradient(term.id) }}
                >
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-medium">{term.label}</p>
                  <p className="text-xs text-text-secondary line-clamp-1">{term.definition}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Sheet>
  );
}
