"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MilestoneTimeline } from "@/components/progress/MilestoneTimeline";
import { StageDetailSheet } from "@/components/progress/StageDetailSheet";
import { useAppStore } from "@/lib/store";
import { completedStagesCount, currentStage, overallProgress } from "@/lib/calculations";
export default function ProgressPage() {
  const stages = useAppStore((s) => s.stages);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = stages.find((s) => s.id === selectedId) ?? null;

  const progress = overallProgress(stages);
  const done = completedStagesCount(stages);
  const stage = currentStage(stages);

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
        </Card>

        <Card className="p-5">
          <MilestoneTimeline stages={stages} onSelect={(s) => setSelectedId(s.id)} />
        </Card>
      </div>

      <StageDetailSheet stage={selected} onClose={() => setSelectedId(null)} />
    </div>
  );
}
