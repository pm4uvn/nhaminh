"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { BudgetPace } from "@/lib/calculations";
import { formatCurrencyCompact } from "@/lib/format";
import { cn } from "@/lib/utils";

export function BudgetPaceDetailSheet({
  open,
  onClose,
  pace,
  budget,
}: {
  open: boolean;
  onClose: () => void;
  pace: BudgetPace;
  budget: number;
}) {
  const isOverBudget = pace.level === "over_budget";
  const spentDisplay = Math.min(100, Math.round(pace.spentPercent));

  return (
    <Sheet open={open} onClose={onClose} title="So sánh chi phí & tiến độ">
      <div className="pt-1 space-y-5">
        <div
          className={cn(
            "flex items-start gap-2.5 rounded-2xl px-4 py-3",
            isOverBudget ? "bg-danger/10" : "bg-warning/10"
          )}
        >
          <AlertTriangle
            size={16}
            className={cn("mt-0.5 shrink-0", isOverBudget ? "text-danger" : "text-warning")}
          />
          <p className="text-sm text-text-primary leading-relaxed">
            {isOverBudget
              ? "Số tiền đã chi đang bằng hoặc vượt ngân sách dự kiến, trong khi nhà chưa hoàn thành. Nên rà soát lại các khoản chi và trao đổi với thầu."
              : "Tốc độ chi tiêu hiện đang nhanh hơn tốc độ thi công. Nếu tiếp tục như vậy, bạn có thể cần nhiều tiền hơn ngân sách ban đầu."}
          </p>
        </div>

        <div className="space-y-4">
          <ComparisonBar
            label="Tiến độ thi công"
            value={pace.progress}
            colorClassName="bg-primary"
          />
          <ComparisonBar
            label="Ngân sách đã chi"
            value={spentDisplay}
            colorClassName={isOverBudget ? "bg-danger" : "bg-warning"}
            overflow={pace.spentPercent > 100}
          />
        </div>

        {pace.projectedTotal !== undefined && pace.projectedOverrun !== undefined && (
          <div className="rounded-2xl bg-surface-2 p-4 space-y-2.5">
            <Row label="Ngân sách dự kiến" value={formatCurrencyCompact(budget)} />
            <Row
              label="Dự kiến cần tới khi xong"
              value={formatCurrencyCompact(pace.projectedTotal)}
              emphasize
            />
            {pace.projectedOverrun > 0 ? (
              <Row
                label="Có thể vượt khoảng"
                value={`+${formatCurrencyCompact(pace.projectedOverrun)}`}
                tone="danger"
              />
            ) : (
              <Row
                label="Vẫn trong ngân sách khoảng"
                value={formatCurrencyCompact(Math.abs(pace.projectedOverrun))}
                tone="success"
              />
            )}
          </div>
        )}

        <p className="text-xs text-text-secondary leading-relaxed">
          Đây là ước tính dựa trên tốc độ chi tiêu và tiến độ hiện tại, không phải con số chính
          xác tuyệt đối — một số khoản (như đặt cọc vật liệu, nội thất) thường được trả trước khi
          thi công xong. Hãy dùng con số này để chủ động trao đổi với thầu, không phải để lo lắng.
        </p>

        <Link href="/expenses">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Xem chi tiết các khoản chi
          </Button>
        </Link>
      </div>
    </Sheet>
  );
}

function ComparisonBar({
  label,
  value,
  colorClassName,
  overflow,
}: {
  label: string;
  value: number;
  colorClassName: string;
  overflow?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-text-secondary">{label}</span>
        <span className="text-sm font-semibold tabular-nums">
          {overflow ? `${value}%+` : `${value}%`}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-surface-2 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-[width] duration-500", colorClassName)}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
  emphasize,
}: {
  label: string;
  value: string;
  tone?: "danger" | "success";
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-text-secondary">{label}</span>
      <span
        className={cn(
          "font-semibold tabular-nums",
          tone === "danger" && "text-danger",
          tone === "success" && "text-success",
          !tone && emphasize && "text-text-primary"
        )}
      >
        {value}
      </span>
    </div>
  );
}
