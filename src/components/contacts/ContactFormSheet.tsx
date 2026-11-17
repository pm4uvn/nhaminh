"use client";

import { useEffect, useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { FieldLabel, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { Contact } from "@/lib/types";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";

const ROLE_SUGGESTIONS = [
  "Thầu chính",
  "Thầu phụ",
  "Thợ điện nước",
  "Thợ sơn",
  "Cung cấp vật liệu",
  "Khác",
];

export function ContactFormSheet({
  open,
  onClose,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  editing?: Contact;
}) {
  const addContact = useAppStore((s) => s.addContact);
  const updateContact = useAppStore((s) => s.updateContact);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resets form fields each time the sheet opens
      setName(editing?.name ?? "");
      setRole(editing?.role ?? "");
      setPhone(editing?.phone ?? "");
    }
  }, [open, editing]);

  const canSave = name.trim().length > 0 && role.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    if (editing) {
      updateContact(editing.id, { name, role, phone: phone || undefined });
      notify.success("Đã cập nhật thông tin");
    } else {
      addContact({ name, role, phone: phone || undefined });
      notify.success("Đã thêm thầu/nhà cung cấp mới");
    }
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={editing ? "Sửa thông tin" : "Thêm thầu/nhà cung cấp"}>
      <div className="space-y-5 pt-1">
        <div>
          <FieldLabel>Tên</FieldLabel>
          <Input
            autoFocus
            placeholder="Ví dụ: Anh Tuấn"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <FieldLabel>Vai trò</FieldLabel>
          <Input
            placeholder="Ví dụ: Thầu chính"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mb-2"
          />
          <div className="flex flex-wrap gap-2">
            {ROLE_SUGGESTIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "text-xs font-medium px-3 py-1.5 rounded-full",
                  role === r ? "bg-primary text-white" : "bg-surface-2 text-text-secondary"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel optional>Số điện thoại</FieldLabel>
          <Input
            type="tel"
            placeholder="090..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <Button className="w-full" size="lg" disabled={!canSave} onClick={handleSave}>
          Lưu
        </Button>
      </div>
    </Sheet>
  );
}
