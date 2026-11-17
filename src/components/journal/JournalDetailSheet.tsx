"use client";

import { Sheet } from "@/components/ui/Sheet";
import { Badge } from "@/components/ui/Badge";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { FieldLabel } from "@/components/ui/Field";
import { formatDate } from "@/lib/format";
import { journalTypeMeta, ISSUE_STATUS_META } from "@/lib/meta";
import { useAppStore } from "@/lib/store";
import { IssueStatus, JournalEntry } from "@/lib/types";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";

const STATUS_ORDER: IssueStatus[] = ["new", "in_progress", "resolved"];

export function JournalDetailSheet({
  entry,
  onClose,
}: {
  entry: JournalEntry | null;
  onClose: () => void;
}) {
  const setIssueStatus = useAppStore((s) => s.setIssueStatus);

  if (!entry) return null;
  const typeMeta = journalTypeMeta(entry.type);
  const Icon = typeMeta.icon;

  return (
    <Sheet open={!!entry} onClose={onClose} title="Chi tiết nhật ký">
      <div className="pt-1 space-y-5">
        <div className="h-48 rounded-2xl overflow-hidden">
          <PhotoPlaceholder
            seed={entry.photoSeed}
            src={entry.photoUrl}
            className="h-full w-full"
            iconSize={32}
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-text-secondary">{formatDate(entry.date)}</span>
            {entry.area && (
              <>
                <span className="text-text-secondary">·</span>
                <span className="text-sm text-text-secondary">{entry.area}</span>
              </>
            )}
          </div>
          <p className="text-[16px] font-medium leading-snug mb-2">{entry.caption}</p>
          <Badge tone="neutral">
            <Icon size={12} /> {typeMeta.label}
          </Badge>
        </div>

        {entry.isIssue && entry.issueStatus && (
          <div>
            <FieldLabel>Trạng thái xử lý</FieldLabel>
            <div className="flex gap-2 mb-4">
              {STATUS_ORDER.map((status) => {
                const meta = ISSUE_STATUS_META[status];
                const active = entry.issueStatus === status;
                return (
                  <button
                    key={status}
                    onClick={() => {
                      if (active) return;
                      setIssueStatus(entry.id, status);
                      notify.success("Đã cập nhật trạng thái sự cố");
                    }}
                    className={cn(
                      "flex-1 rounded-xl border px-2 py-2 text-xs font-medium transition-colors",
                      active
                        ? "border-primary bg-primary-light text-primary-dark"
                        : "border-border bg-surface-2 text-text-secondary"
                    )}
                  >
                    {meta.label}
                  </button>
                );
              })}
            </div>

            {entry.issueHistory && entry.issueHistory.length > 0 && (
              <div>
                <FieldLabel optional>Lịch sử xử lý</FieldLabel>
                <div className="space-y-3">
                  {entry.issueHistory.map((h, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          {ISSUE_STATUS_META[h.status].label}{" "}
                          <span className="text-text-secondary font-normal">
                            · {formatDate(h.date)}
                          </span>
                        </p>
                        {h.note && (
                          <p className="text-sm text-text-secondary mt-0.5">{h.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Sheet>
  );
}
