import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Stage } from "@/lib/types";
import { completedStagesCount, currentStage, overallProgress } from "@/lib/calculations";

export function ProgressCard({ stages }: { stages: Stage[] }) {
  const progress = overallProgress(stages);
  const done = completedStagesCount(stages);
  const stage = currentStage(stages);

  return (
    <Link href="/progress">
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-text-secondary">Tiến độ ngôi nhà</h2>
          <ChevronRight size={18} className="text-text-secondary" />
        </div>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-4xl font-bold text-primary tabular-nums">{progress}%</span>
          {stage && (
            <span className="text-sm font-medium text-text-secondary mb-1.5">
              Đang {stage.name}
            </span>
          )}
        </div>
        <ProgressBar value={progress} />
        <p className="text-sm text-text-secondary mt-2.5">
          {done}/{stages.length} giai đoạn đã hoàn thành
        </p>
      </Card>
    </Link>
  );
}
