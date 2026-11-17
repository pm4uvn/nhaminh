"use client";

import { useEffect, useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { FieldLabel, Input } from "@/components/ui/Field";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { ImagePicker } from "@/components/ui/ImagePicker";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { Material, MaterialStatus } from "@/lib/types";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";

export function MaterialFormSheet({
  open,
  onClose,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  editing?: Material;
}) {
  const addMaterial = useAppStore((s) => s.addMaterial);
  const updateMaterial = useAppStore((s) => s.updateMaterial);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [supplier, setSupplier] = useState("");
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState<MaterialStatus>("considering");
  const [photo, setPhoto] = useState<string | undefined>();

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resets form fields each time the sheet opens
      setName(editing?.name ?? "");
      setCode(editing?.code ?? "");
      setSupplier(editing?.supplier ?? "");
      setPrice(editing?.price ?? 0);
      setStatus(editing?.status ?? "considering");
      setPhoto(editing?.photoUrl);
    }
  }, [open, editing]);

  const canSave = name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const payload = {
      name,
      code,
      supplier: supplier || undefined,
      price: price || undefined,
      status,
      photoUrl: photo,
      photoSeed: photo ? undefined : name,
    };
    if (editing) {
      updateMaterial(editing.id, payload);
      notify.success("Đã cập nhật vật liệu");
    } else {
      addMaterial(payload);
      notify.success("Đã thêm vật liệu mới");
    }
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={editing ? "Sửa vật liệu" : "Thêm vật liệu"}>
      <div className="space-y-5 pt-1">
        <ImagePicker value={photo} onChange={setPhoto} label="Thêm ảnh vật liệu" />

        <div>
          <FieldLabel>Tên vật liệu</FieldLabel>
          <Input
            autoFocus
            placeholder="Ví dụ: Gạch phòng khách"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <FieldLabel optional>Mã sản phẩm</FieldLabel>
          <Input
            placeholder="Ví dụ: Viglacera HM803"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <div>
          <FieldLabel optional>Nhà cung cấp</FieldLabel>
          <Input
            placeholder="Ví dụ: Viglacera"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          />
        </div>

        <div>
          <FieldLabel optional>Giá</FieldLabel>
          <CurrencyInput value={price} onChange={setPrice} />
        </div>

        <div>
          <FieldLabel optional>Trạng thái</FieldLabel>
          <div className="flex gap-2">
            {(["considering", "confirmed"] as MaterialStatus[]).map((s) => {
              const active = status === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={cn(
                    "flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-primary-light text-primary-dark"
                      : "border-border bg-surface-2 text-text-secondary"
                  )}
                >
                  {s === "considering" ? "Đang cân nhắc" : "Đã chốt"}
                </button>
              );
            })}
          </div>
        </div>

        <Button className="w-full" size="lg" disabled={!canSave} onClick={handleSave}>
          Lưu vật liệu
        </Button>
      </div>
    </Sheet>
  );
}
