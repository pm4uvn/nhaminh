import { Check } from "lucide-react";
import { Stage } from "@/lib/types";
import { stageProgress } from "@/lib/calculations";
import { STAGE_STATUS_META } from "@/lib/meta";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function MilestoneTimeline({
  stages,
  onSelect,
}: {
  stages: Stage[];
  onSelect: (stage: Stage) => void;
}) {
  return (
    <div className="relative">
      {stages.map((stage, i) => {
        const statusMeta = STAGE_STATUS_META[stage.status];
        const progress = stageProgress(stage);
        const isLast = i === stages.length - 1;
        return (
          <button
            key={stage.id}
            onClick={() => onSelect(stage)}
            className="w-full flex gap-4 text-left relative"
          >
            <div className="flex flex-col items-center shrink-0">
              <div
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 z-10",
                  stage.status === "done" && "bg-success text-white",
                  stage.status === "doing" && "bg-primary text-white ring-4 ring-primary/15",
                  stage.status === "todo" && "bg-surface-2 text-text-secondary border border-border"
                )}
              >
                {stage.status === "done" ? <Check size={16} /> : stage.order}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-10",
                    stage.status === "done" ? "bg-success" : "bg-border"
                  )}
                />
              )}
            </div>
            <div className="flex-1 pb-8 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-[15px]">{stage.name}</h3>
                <Badge tone={statusMeta.tone === "primary" ? "primary" : statusMeta.tone === "success" ? "success" : "neutral"}>
                  {statusMeta.label}
                </Badge>
              </div>
              <p className="text-sm text-text-secondary mb-2 line-clamp-1">{stage.description}</p>
              {stage.checklist.length > 0 && (
                <p className="text-xs text-text-secondary">
                  {stage.checklist.filter((c) => c.done).length}/{stage.checklist.length} việc hoàn thành · {progress}%
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
