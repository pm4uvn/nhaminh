"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { formatCurrency } from "@/lib/format";
import { MATERIAL_STATUS_META } from "@/lib/meta";
import { useAppStore } from "@/lib/store";
import { Material, MaterialStatus } from "@/lib/types";
import { notify } from "@/lib/toast";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function MaterialDetailSheet({
  material,
  onClose,
  onEdit,
}: {
  material: Material | null;
  onClose: () => void;
  onEdit: (material: Material) => void;
}) {
  const updateMaterial = useAppStore((s) => s.updateMaterial);
  const deleteMaterial = useAppStore((s) => s.deleteMaterial);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!material) return null;

  return (
    <>
      <Sheet open={!!material} onClose={onClose} title="Chi tiết vật liệu">
        <div className="pt-1 space-y-5">
          <div className="h-44 rounded-2xl overflow-hidden">
            <PhotoPlaceholder seed={material.photoSeed} src={material.photoUrl} className="h-full w-full" iconSize={28} />
          </div>

          <div>
            <p className="text-[16px] font-semibold">{material.name}</p>
            <p className="text-sm text-text-secondary">{material.code}</p>
          </div>

          <div className="space-y-2.5 text-sm">
            {material.supplier && (
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Nhà cung cấp</span>
                <span className="font-medium">{material.supplier}</span>
              </div>
            )}
            {material.price !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Giá</span>
                <span className="font-medium tabular-nums">{formatCurrency(material.price)}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {(["considering", "confirmed"] as MaterialStatus[]).map((s) => {
              const meta = MATERIAL_STATUS_META[s];
              const active = material.status === s;
              return (
                <button
                  key={s}
                  onClick={() => {
                    if (active) return;
                    updateMaterial(material.id, { status: s });
                    notify.success("Đã cập nhật trạng thái vật liệu");
                  }}
                  className={cn(
                    "flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                    active ? "border-primary bg-primary-light text-primary-dark" : "border-border bg-surface-2 text-text-secondary"
                  )}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onEdit(material)}>
              <Pencil size={16} /> Sửa
            </Button>
            <Button variant="danger" className="flex-1" onClick={() => setConfirmDelete(true)}>
              <Trash2 size={16} /> Xóa
            </Button>
          </div>
        </div>
      </Sheet>

      <ConfirmDialog
        open={confirmDelete}
        title="Xóa vật liệu này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteMaterial(material.id);
          setConfirmDelete(false);
          onClose();
          notify.success("Đã xóa vật liệu");
        }}
      />
    </>
  );
}
