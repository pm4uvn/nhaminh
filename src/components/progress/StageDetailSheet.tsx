"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Plus, HelpCircle, ShieldAlert } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { Input, FieldLabel, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { Stage, StageStatus } from "@/lib/types";
import { stageProgress } from "@/lib/calculations";
import { STAGE_STATUS_META } from "@/lib/meta";
import { getStageQuestions } from "@/lib/stage-questions";
import { matchCheckpointForChecklistTitle, CHECKPOINT_META } from "@/lib/checkpoints";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { TermText } from "@/components/glossary/TermText";

export function StageDetailSheet({
  stage,
  onClose,
}: {
  stage: Stage | null;
  onClose: () => void;
}) {
  const toggleChecklistItem = useAppStore((s) => s.toggleChecklistItem);
  const addChecklistItem = useAppStore((s) => s.addChecklistItem);
  const setStageStatus = useAppStore((s) => s.setStageStatus);
  const setStageNote = useAppStore((s) => s.setStageNote);
  const toggleAskedQuestion = useAppStore((s) => s.toggleAskedQuestion);
  const evidenceRecords = useAppStore((s) => s.evidenceRecords);

  const [newItem, setNewItem] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resets to this stage's own note each time a different stage is opened
    setNote(stage?.note ?? "");
  }, [stage]);

  if (!stage) return null;
  const progress = stageProgress(stage);
  const remaining = stage.checklist.filter((c) => !c.done).length;
  const questions = getStageQuestions(stage.order);
  const askedIds = stage.askedQuestionIds ?? [];

  const statusOptions: StageStatus[] = ["todo", "doing", "done"];

  return (
    <Sheet open={!!stage} onClose={onClose} title={stage.name}>
      <div className="pt-1 space-y-5">
        <p className="text-sm text-text-secondary">
          <TermText text={stage.description} />
        </p>
        <p className="text-xs text-text-secondary -mt-3">
          Chạm vào từ gạch chân để xem giải nghĩa.
        </p>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Tiến độ công việc</span>
            <span className="text-sm font-semibold text-primary">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {remaining > 0 && (
            <p className="text-xs text-text-secondary mt-1.5">Còn {remaining} việc chưa xong</p>
          )}
        </div>

        <div>
          <FieldLabel>Trạng thái giai đoạn</FieldLabel>
          <div className="flex gap-2">
            {statusOptions.map((s) => {
              const meta = STAGE_STATUS_META[s];
              const active = stage.status === s;
              return (
                <button
                  key={s}
                  onClick={() => {
                    setStageStatus(stage.id, s);
                    notify.success("Đã cập nhật trạng thái giai đoạn");
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
        </div>

        <div>
          <FieldLabel>Danh sách việc cần làm</FieldLabel>
          <div className="space-y-1">
            {stage.checklist.map((item) => {
              const checkpoint = matchCheckpointForChecklistTitle(item.title);
              const hasEvidence = checkpoint
                ? evidenceRecords.some((e) => e.checkpointType === checkpoint)
                : true;
              const showWarning = checkpoint && !item.done && !hasEvidence;

              return (
                <div key={item.id}>
                  <div className="w-full flex items-center gap-3 py-2 text-left">
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleChecklistItem(stage.id, item.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleChecklistItem(stage.id, item.id);
                        }
                      }}
                      className={cn(
                        "h-5 w-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer",
                        item.done ? "bg-success border-success text-white" : "border-border"
                      )}
                    >
                      {item.done && <Check size={12} />}
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleChecklistItem(stage.id, item.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleChecklistItem(stage.id, item.id);
                        }
                      }}
                      className={cn(
                        "text-[15px] flex-1 cursor-pointer",
                        item.done && "line-through text-text-secondary"
                      )}
                    >
                      <TermText text={item.title} />
                    </span>
                  </div>
                  {showWarning && (
                    <Link
                      href="/evidence"
                      className="flex items-center gap-1.5 ml-8 mb-1.5 text-xs text-terracotta font-medium"
                    >
                      <ShieldAlert size={13} />
                      Chưa lưu ảnh &quot;{CHECKPOINT_META[checkpoint].label.toLowerCase()}&quot; —
                      lưu trước khi che kín
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 mt-3">
            <Input
              placeholder="Thêm việc mới..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newItem.trim()) {
                  addChecklistItem(stage.id, newItem.trim());
                  setNewItem("");
                }
              }}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (!newItem.trim()) return;
                addChecklistItem(stage.id, newItem.trim());
                setNewItem("");
              }}
            >
              <Plus size={18} />
            </Button>
          </div>
        </div>

        {questions.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <HelpCircle size={15} className="text-terracotta" />
              <FieldLabel>Câu hỏi nên hỏi thầu</FieldLabel>
            </div>
            <p className="text-xs text-text-secondary mb-2 -mt-1">
              Hỏi trước khi ký nhận hoặc thanh toán cho giai đoạn này.
            </p>
            <div className="space-y-1">
              {questions.map((q) => {
                const asked = askedIds.includes(q.id);
                return (
                  <div key={q.id} className="w-full flex items-center gap-3 py-2 text-left">
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleAskedQuestion(stage.id, q.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleAskedQuestion(stage.id, q.id);
                        }
                      }}
                      className={cn(
                        "h-5 w-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer",
                        asked ? "bg-terracotta border-terracotta text-white" : "border-border"
                      )}
                    >
                      {asked && <Check size={12} />}
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleAskedQuestion(stage.id, q.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleAskedQuestion(stage.id, q.id);
                        }
                      }}
                      className={cn(
                        "text-[15px] flex-1 cursor-pointer",
                        asked && "text-text-secondary"
                      )}
                    >
                      {q.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <FieldLabel optional>Ghi chú</FieldLabel>
          <Textarea
            placeholder="Ghi chú thêm về giai đoạn này..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={() => setStageNote(stage.id, note)}
          />
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          Danh sách này giúp bạn theo dõi tiến độ thi công cùng thầu, không thay thế cho nghiệm
          thu hoặc kiểm định kỹ thuật chuyên môn.
        </p>
      </div>
    </Sheet>
  );
}
