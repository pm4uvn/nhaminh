"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MilestoneTimeline } from "@/components/progress/MilestoneTimeline";
import { StageDetailSheet } from "@/components/progress/StageDetailSheet";
import { useAppStore } from "@/lib/store";
import {
  completedStagesCount,
  currentStage,
  estimateCompletion,
  overallProgress,
} from "@/lib/calculations";
import { formatDate, formatWeeksRemaining } from "@/lib/format";
import { CalendarClock, PartyPopper } from "lucide-react";

export default function ProgressPage() {
  const stages = useAppStore((s) => s.stages);
  const startDate = useAppStore((s) => s.homeProfile?.startDate);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = stages.find((s) => s.id === selectedId) ?? null;

  const progress = overallProgress(stages);
  const done = completedStagesCount(stages);
  const stage = currentStage(stages);
  const estimate = estimateCompletion(stages, startDate);

  return (
    <div className="pb-6">
      <PageHeader title="Tiến độ xây nhà" />

      <div className="px-5 space-y-5">
        <Card className="p-5">
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-primary tabular-nums">{progress}%</span>
            {stage && (
              <span className="text-sm text-text-secondary mb-1">Đang {stage.name}</span>
            )}
          </div>
          <ProgressBar value={progress} />
          <p className="text-sm text-text-secondary mt-2">
            {done}/{stages.length} giai đoạn đã hoàn thành
          </p>

          {estimate.status === "ok" && estimate.weeksRemaining && estimate.estimatedDate && (
            <div className="flex items-start gap-2 rounded-xl bg-primary-light px-3 py-2.5 mt-3">
              <CalendarClock size={16} className="text-primary-dark mt-0.5 shrink-0" />
              <p className="text-sm text-primary-dark leading-snug">
                Còn {formatWeeksRemaining(estimate.weeksRemaining)} nữa là xong! Dự kiến xong vào
                khoảng {formatDate(estimate.estimatedDate)}.
              </p>
            </div>
          )}

          {estimate.status === "completed" && (
            <div className="flex items-start gap-2 rounded-xl bg-success/10 px-3 py-2.5 mt-3">
              <PartyPopper size={16} className="text-success mt-0.5 shrink-0" />
              <p className="text-sm text-text-primary leading-snug">
                Chúc mừng, ngôi nhà đã hoàn thành mọi việc trong danh sách! 🎉
              </p>
            </div>
          )}
        </Card>

        <Card className="p-5">
          <MilestoneTimeline stages={stages} onSelect={(s) => setSelectedId(s.id)} />
        </Card>
      </div>

      <StageDetailSheet stage={selected} onClose={() => setSelectedId(null)} />
    </div>
  );
}
