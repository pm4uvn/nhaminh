"use client";

import { useEffect, useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { FieldLabel, Input } from "@/components/ui/Field";
import { PhotoPinEditor } from "./PhotoPinEditor";
import { useAppStore } from "@/lib/store";
import { CHECKPOINT_META, CHECKPOINT_ORDER } from "@/lib/checkpoints";
import { CheckpointType, PhotoPin } from "@/lib/types";
import { todayISO } from "@/lib/format";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Camera, Plus, Trash2, X } from "lucide-react";

export function EvidenceFormSheet({
  open,
  onClose,
  defaultRoomId,
}: {
  open: boolean;
  onClose: () => void;
  defaultRoomId?: string;
}) {
  const rooms = useAppStore((s) => s.rooms);
  const addRoom = useAppStore((s) => s.addRoom);
  const addEvidenceRecord = useAppStore((s) => s.addEvidenceRecord);

  const [roomId, setRoomId] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [checkpointType, setCheckpointType] = useState<CheckpointType>("before_plaster");
  const [photo, setPhoto] = useState<string | undefined>();
  const [pins, setPins] = useState<PhotoPin[]>([]);
  const [pendingPin, setPendingPin] = useState<{ x: number; y: number } | null>(null);
  const [pinLabel, setPinLabel] = useState("");
  const [pinNote, setPinNote] = useState("");
  const [confirmedBy, setConfirmedBy] = useState("");

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resets form fields each time the sheet opens
      setRoomId(defaultRoomId ?? rooms[0]?.id ?? "");
      setNewRoomName("");
      setCheckpointType("before_plaster");
      setPhoto(undefined);
      setPins([]);
      setPendingPin(null);
      setPinLabel("");
      setPinNote("");
      setConfirmedBy("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ cần reset khi mở lại, không theo rooms
  }, [open, defaultRoomId]);

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;
    addRoom(newRoomName.trim());
    setNewRoomName("");
  };

  const savePin = () => {
    if (!pendingPin || !pinLabel.trim()) return;
    setPins((prev) => [
      ...prev,
      { id: `pin-${Date.now()}`, x: pendingPin.x, y: pendingPin.y, label: pinLabel.trim(), note: pinNote || undefined },
    ]);
    setPendingPin(null);
    setPinLabel("");
    setPinNote("");
  };

  const canSave = !!roomId && pins.length > 0;

  const handleSave = () => {
    if (!canSave) return;
    addEvidenceRecord({
      roomId,
      checkpointType,
      photoUrl: photo,
      pins,
      date: todayISO(),
      confirmedBy: confirmedBy || undefined,
    });
    notify.success("Đã lưu bằng chứng trước khi che kín");
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Lưu bằng chứng trước khi che kín">
      <div className="space-y-5 pt-1">
        <div>
          <FieldLabel>Phòng/khu vực</FieldLabel>
          {rooms.length > 0 && (
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full h-12 rounded-2xl bg-surface-2 border border-border px-4 text-[15px] mb-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Thêm phòng mới, vd: Phòng ngủ 2"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()}
            />
            <Button variant="outline" size="icon" onClick={handleCreateRoom}>
              <Plus size={18} />
            </Button>
          </div>
        </div>

        <div>
          <FieldLabel>Mốc thời điểm</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {CHECKPOINT_ORDER.map((cp) => {
              const meta = CHECKPOINT_META[cp];
              const Icon = meta.icon;
              const active = checkpointType === cp;
              return (
                <button
                  key={cp}
                  type="button"
                  onClick={() => setCheckpointType(cp)}
                  className={cn(
                    "flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-primary-light text-primary-dark"
                      : "border-border bg-surface-2 text-text-secondary"
                  )}
                >
                  <Icon size={16} />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <FieldLabel optional>Ảnh khu vực — chạm vào ảnh để ghim vị trí</FieldLabel>
          <div className="relative">
            <PhotoPinEditor
              photoUrl={photo}
              photoSeed={checkpointType}
              pins={pins}
              onAddPin={(x, y) => setPendingPin({ x, y })}
              className="h-56"
            />
            <label className="absolute top-2 right-2 h-9 w-9 rounded-full bg-black/50 text-white flex items-center justify-center cursor-pointer">
              {photo ? <X size={16} onClick={(e) => { e.preventDefault(); setPhoto(undefined); }} /> : <Camera size={16} />}
              {!photo && (
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setPhoto(reader.result as string);
                    reader.readAsDataURL(file);
                  }}
                />
              )}
            </label>
          </div>
          {!photo && (
            <p className="text-xs text-text-secondary mt-1.5">
              Chưa có ảnh vẫn ghim được vị trí tạm — bấm icon máy ảnh để thêm ảnh thật bất cứ lúc
              nào.
            </p>
          )}
        </div>

        {pendingPin && (
          <div className="rounded-2xl border border-primary/30 bg-primary-light p-4 space-y-3">
            <p className="text-sm font-medium text-primary-dark">Ghim vị trí mới</p>
            <Input
              autoFocus
              placeholder="Đây là gì? Vd: Đường cấp nước lạnh"
              value={pinLabel}
              onChange={(e) => setPinLabel(e.target.value)}
            />
            <Input
              placeholder="Kích thước/vị trí (không bắt buộc), vd: cách góc trái 40cm"
              value={pinNote}
              onChange={(e) => setPinNote(e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setPendingPin(null)}>
                Hủy
              </Button>
              <Button className="flex-1" disabled={!pinLabel.trim()} onClick={savePin}>
                Thêm ghim
              </Button>
            </div>
          </div>
        )}

        {pins.length > 0 && (
          <div>
            <FieldLabel>Các vị trí đã ghim ({pins.length})</FieldLabel>
            <div className="space-y-2">
              {pins.map((p, i) => (
                <div key={p.id} className="flex items-start gap-2.5 rounded-xl bg-surface-2 px-3 py-2.5">
                  <span className="h-5 w-5 shrink-0 rounded-full bg-terracotta text-white text-[11px] font-semibold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{p.label}</p>
                    {p.note && <p className="text-xs text-text-secondary">{p.note}</p>}
                  </div>
                  <button
                    onClick={() => setPins((prev) => prev.filter((x) => x.id !== p.id))}
                    aria-label="Xóa ghim"
                    className="text-text-secondary shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <FieldLabel optional>Người xác nhận</FieldLabel>
          <Input
            placeholder="Vd: Anh Tuấn (thầu chính)"
            value={confirmedBy}
            onChange={(e) => setConfirmedBy(e.target.value)}
          />
        </div>

        <Button className="w-full" size="lg" disabled={!canSave} onClick={handleSave}>
          Lưu bằng chứng
        </Button>
        {!canSave && (
          <p className="text-xs text-text-secondary text-center -mt-3">
            Chọn phòng và ghim ít nhất 1 vị trí trên ảnh trước khi lưu.
          </p>
        )}
      </div>
    </Sheet>
  );
}
