"use client";

import { useEffect, useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Input, FieldLabel } from "@/components/ui/Field";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Badge } from "@/components/ui/Badge";
import { documentCategoryMeta } from "@/lib/meta";
import { formatDate } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { DocumentRecord } from "@/lib/types";
import { notify } from "@/lib/toast";
import { Trash2 } from "lucide-react";

export function DocumentDetailSheet({
  document,
  onClose,
}: {
  document: DocumentRecord | null;
  onClose: () => void;
}) {
  const renameDocument = useAppStore((s) => s.renameDocument);
  const deleteDocument = useAppStore((s) => s.deleteDocument);
  const [name, setName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resets form field when a new document is opened
    setName(document?.name ?? "");
  }, [document]);

  if (!document) return null;
  const meta = documentCategoryMeta(document.category);
  const Icon = meta.icon;

  return (
    <>
      <Sheet open={!!document} onClose={onClose} title="Chi tiết tài liệu">
        <div className="pt-1 space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary-light text-primary-dark flex items-center justify-center">
              <Icon size={22} />
            </div>
            <div>
              <Badge tone="primary">{meta.label}</Badge>
              <p className="text-xs text-text-secondary mt-1">Thêm ngày {formatDate(document.addedDate)}</p>
            </div>
          </div>

          <div>
            <FieldLabel>Tên tài liệu</FieldLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => {
                if (name.trim() && name !== document.name) {
                  renameDocument(document.id, name.trim());
                  notify.success("Đã đổi tên tài liệu");
                }
              }}
            />
          </div>

          <Button variant="danger" className="w-full" onClick={() => setConfirmDelete(true)}>
            <Trash2 size={16} /> Xóa tài liệu
          </Button>
        </div>
      </Sheet>

      <ConfirmDialog
        open={confirmDelete}
        title="Xóa tài liệu này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteDocument(document.id);
          setConfirmDelete(false);
          onClose();
          notify.success("Đã xóa tài liệu");
        }}
      />
    </>
  );
}
