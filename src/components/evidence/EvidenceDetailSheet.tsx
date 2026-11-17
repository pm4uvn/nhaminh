"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Badge } from "@/components/ui/Badge";
import { PhotoPinEditor } from "./PhotoPinEditor";
import { CHECKPOINT_META } from "@/lib/checkpoints";
import { useAppStore } from "@/lib/store";
import { EvidenceRecord, PhotoPin, Room } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { notify } from "@/lib/toast";
import { Trash2, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function EvidenceDetailSheet({
  record,
  room,
  onClose,
}: {
  record: EvidenceRecord | null;
  room?: Room;
  onClose: () => void;
}) {
  const deleteEvidenceRecord = useAppStore((s) => s.deleteEvidenceRecord);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedPin, setSelectedPin] = useState<PhotoPin | null>(null);

  if (!record) return null;
  const meta = CHECKPOINT_META[record.checkpointType];

  return (
    <>
      <Sheet open={!!record} onClose={onClose} title={room?.name ?? "Chưa gắn phòng"}>
        <div className="pt-1 space-y-4">
          <div className="flex items-center gap-2">
            <Badge tone="primary">{meta.label}</Badge>
            <span className="text-xs text-text-secondary">{formatDate(record.date)}</span>
          </div>

          <PhotoPinEditor
            photoUrl={record.photoUrl}
            photoSeed={record.photoSeed ?? record.checkpointType}
            pins={record.pins}
            readOnly
            onSelectPin={setSelectedPin}
            className="h-56"
          />
          <p className="text-xs text-text-secondary -mt-2">Chạm vào ghim số để xem chi tiết.</p>

          {selectedPin && (
            <div className="rounded-2xl bg-primary-light p-3.5">
              <p className="text-sm font-medium text-primary-dark">{selectedPin.label}</p>
              {selectedPin.note && (
                <p className="text-xs text-primary-dark/80 mt-0.5">{selectedPin.note}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            {record.pins.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setSelectedPin(p)}
                className={cn(
                  "w-full flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-left",
                  selectedPin?.id === p.id ? "bg-primary-light" : "bg-surface-2"
                )}
              >
                <span className="h-5 w-5 shrink-0 rounded-full bg-terracotta text-white text-[11px] font-semibold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{p.label}</p>
                  {p.note && <p className="text-xs text-text-secondary">{p.note}</p>}
                </div>
              </button>
            ))}
          </div>

          {record.confirmedBy && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <UserCheck size={15} /> Xác nhận bởi {record.confirmedBy}
            </div>
          )}

          <Button variant="danger" className="w-full" onClick={() => setConfirmDelete(true)}>
            <Trash2 size={16} /> Xóa bằng chứng này
          </Button>
        </div>
      </Sheet>

      <ConfirmDialog
        open={confirmDelete}
        title="Xóa bằng chứng này?"
        description="Toàn bộ vị trí đã ghim trong ảnh này sẽ mất. Hành động này không thể hoàn tác."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteEvidenceRecord(record.id);
          setConfirmDelete(false);
          onClose();
          notify.success("Đã xóa bằng chứng");
        }}
      />
    </>
  );
}
