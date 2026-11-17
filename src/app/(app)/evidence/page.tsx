"use client";

import { useMemo, useState } from "react";
import { Plus, Search, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { EvidenceCard } from "@/components/evidence/EvidenceCard";
import { EvidenceFormSheet } from "@/components/evidence/EvidenceFormSheet";
import { EvidenceDetailSheet } from "@/components/evidence/EvidenceDetailSheet";
import { useAppStore } from "@/lib/store";
import { CHECKPOINT_META, CHECKPOINT_ORDER } from "@/lib/checkpoints";
import { CheckpointType, EvidenceRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function EvidencePage() {
  const rooms = useAppStore((s) => s.rooms);
  const evidenceRecords = useAppStore((s) => s.evidenceRecords);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CheckpointType | "all">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  const detail = evidenceRecords.find((e) => e.id === detailId) ?? null;
  const detailRoom = rooms.find((r) => r.id === detail?.roomId);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...evidenceRecords]
      .filter((e) => filter === "all" || e.checkpointType === filter)
      .filter((e) => {
        if (!q) return true;
        const room = rooms.find((r) => r.id === e.roomId);
        const haystack = [
          room?.name ?? "",
          ...e.pins.map((p) => `${p.label} ${p.note ?? ""}`),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [evidenceRecords, rooms, filter, query]);

  const groups = useMemo(() => {
    const map = new Map<string, EvidenceRecord[]>();
    for (const e of filtered) {
      const key = e.roomId;
      map.set(key, [...(map.get(key) ?? []), e]);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <div className="pb-6">
      <PageHeader title="Trước khi che kín" onBack />

      <div className="px-5 space-y-4">
        <p className="text-sm text-text-secondary leading-relaxed">
          Lưu ảnh và vị trí đường ống, dây điện trước khi tường/sàn bị che kín — để sau này tìm
          lại dễ dàng, ví dụ &quot;ống nước sau tủ bếp nằm đâu?&quot;.
        </p>

        <Button className="w-full" size="lg" onClick={() => setFormOpen(true)}>
          <Plus size={18} /> Lưu bằng chứng mới
        </Button>

        <div className="relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo phòng hoặc vị trí đã ghim..."
            className="w-full h-11 rounded-2xl bg-surface-2 border border-border pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
          <FilterChip active={filter === "all"} label="Tất cả" onClick={() => setFilter("all")} />
          {CHECKPOINT_ORDER.map((cp) => (
            <FilterChip
              key={cp}
              active={filter === cp}
              label={CHECKPOINT_META[cp].label}
              onClick={() => setFilter(cp)}
            />
          ))}
        </div>

        {groups.length === 0 ? (
          <Card className="p-4">
            <EmptyState
              icon={ShieldCheck}
              title="Chưa có bằng chứng nào"
              description="Chụp lại vị trí đường ống, dây điện trước khi tô tường, đổ bê tông hoặc lát nền."
            />
          </Card>
        ) : (
          groups.map(([roomId, records]) => {
            const room = rooms.find((r) => r.id === roomId);
            return (
              <Card key={roomId} className="p-4">
                <p className="text-sm font-semibold mb-1">{room?.name ?? "Chưa gắn phòng"}</p>
                <div className="divide-y divide-border">
                  {records.map((r) => (
                    <EvidenceCard key={r.id} record={r} room={room} onClick={() => setDetailId(r.id)} />
                  ))}
                </div>
              </Card>
            );
          })
        )}
      </div>

      <EvidenceFormSheet open={formOpen} onClose={() => setFormOpen(false)} />
      <EvidenceDetailSheet record={detail} room={detailRoom} onClose={() => setDetailId(null)} />
    </div>
  );
}

function FilterChip({
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
        "shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors",
        active ? "bg-primary text-white border-primary" : "bg-surface text-text-secondary border-border"
      )}
    >
      {label}
    </button>
  );
}
