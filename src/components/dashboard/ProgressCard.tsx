import Link from "next/link";
import { ChevronRight, CalendarClock, PartyPopper } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Stage } from "@/lib/types";
import {
  completedStagesCount,
  currentStage,
  estimateCompletion,
  overallProgress,
} from "@/lib/calculations";
import { formatDate, formatWeeksRemaining } from "@/lib/format";

export function ProgressCard({ stages, startDate }: { stages: Stage[]; startDate?: string }) {
  const progress = overallProgress(stages);
  const done = completedStagesCount(stages);
  const stage = currentStage(stages);
  const estimate = estimateCompletion(stages, startDate);

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
    </Link>
  );
}
