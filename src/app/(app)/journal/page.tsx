"use client";

import { useMemo, useState } from "react";
import { Plus, Images, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { JournalCard } from "@/components/journal/JournalCard";
import { JournalFormSheet } from "@/components/journal/JournalFormSheet";
import { JournalDetailSheet } from "@/components/journal/JournalDetailSheet";
import { BeforeAfterSheet } from "@/components/journal/BeforeAfterSheet";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Filter = "all" | "issue";

export default function JournalPage() {
  const journal = useAppStore((s) => s.journal);

  const [filter, setFilter] = useState<Filter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  const selected = journal.find((j) => j.id === selectedId) ?? null;

  const sorted = useMemo(
    () => [...journal].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [journal]
  );
  const filtered = filter === "issue" ? sorted.filter((j) => j.isIssue) : sorted;

  return (
    <div className="pb-6">
      <PageHeader title="Nhật ký ngôi nhà" />

      <div className="px-5 space-y-4">
        <Button className="w-full" size="lg" onClick={() => setFormOpen(true)}>
          <Plus size={18} /> Thêm nhật ký
        </Button>

        <div className="flex gap-2">
          <Chip active={filter === "all"} label="Tất cả" onClick={() => setFilter("all")} />
          <Chip active={filter === "issue"} label="Sự cố" onClick={() => setFilter("issue")} />
          <button
            onClick={() => setCompareOpen(true)}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-border bg-surface text-text-secondary"
          >
            <Images size={14} /> Trước & Sau
          </button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={filter === "issue" ? "Không có sự cố nào" : "Chưa có nhật ký nào"}
            description="Ghi lại hành trình xây nhà của bạn — dễ như đăng một bức ảnh."
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((entry) => (
              <JournalCard key={entry.id} entry={entry} onClick={() => setSelectedId(entry.id)} />
            ))}
          </div>
        )}
      </div>

      <JournalFormSheet open={formOpen} onClose={() => setFormOpen(false)} />
      <JournalDetailSheet entry={selected} onClose={() => setSelectedId(null)} />
      <BeforeAfterSheet
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        entries={sorted}
      />
    </div>
  );
}

function Chip({
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
        "px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors",
        active ? "bg-primary text-white border-primary" : "bg-surface text-text-secondary border-border"
      )}
    >
      {label}
    </button>
  );
}
