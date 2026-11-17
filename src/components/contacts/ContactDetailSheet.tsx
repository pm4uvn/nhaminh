"use client";

import { useState } from "react";
import { Phone, Pencil, Plus, Trash2, User } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { StarRating, averageRating } from "./StarRating";
import { ReviewFormSheet } from "./ReviewFormSheet";
import { useAppStore } from "@/lib/store";
import { Contact } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { notify } from "@/lib/toast";

export function ContactDetailSheet({
  contact,
  onClose,
  onEdit,
}: {
  contact: Contact | null;
  onClose: () => void;
  onEdit: (contact: Contact) => void;
}) {
  const stages = useAppStore((s) => s.stages);
  const deleteContact = useAppStore((s) => s.deleteContact);
  const deleteContactReview = useAppStore((s) => s.deleteContactReview);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeleteReview, setConfirmDeleteReview] = useState<string | null>(null);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);

  if (!contact) return null;
  const avg = averageRating(contact.reviews);

  return (
    <>
      <Sheet open={!!contact} onClose={onClose} title="Chi tiết">
        <div className="pt-1 space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary-light text-primary-dark flex items-center justify-center shrink-0">
              <User size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-[16px] font-semibold truncate">{contact.name}</p>
              <p className="text-sm text-text-secondary truncate">{contact.role}</p>
            </div>
          </div>

          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-2.5 rounded-2xl bg-surface-2 px-4 py-3 text-sm font-medium text-text-primary"
            >
              <Phone size={16} className="text-primary" /> {contact.phone}
            </a>
          )}

          <div className="rounded-2xl bg-surface-2 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary mb-1">Đánh giá trung bình</p>
              {contact.reviews.length > 0 ? (
                <div className="flex items-center gap-2">
                  <StarRating rating={avg} size={16} />
                  <span className="text-sm font-semibold tabular-nums">{avg.toFixed(1)}/5</span>
                </div>
              ) : (
                <p className="text-sm text-text-secondary">Chưa có đánh giá nào</p>
              )}
            </div>
            <Button size="sm" variant="outline" onClick={() => setReviewFormOpen(true)}>
              <Plus size={14} /> Đánh giá
            </Button>
          </div>

          {contact.reviews.length > 0 && (
            <div className="space-y-3">
              {contact.reviews.map((r) => {
                const stageName = stages.find((s) => s.id === r.stageId)?.name;
                return (
                  <div key={r.id} className="rounded-2xl border border-border p-3.5">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <StarRating rating={r.rating} size={14} />
                      <button
                        onClick={() => setConfirmDeleteReview(r.id)}
                        aria-label="Xóa đánh giá"
                        className="text-text-secondary"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-text-secondary mb-1.5">
                      {formatDate(r.date)}
                      {stageName && ` · ${stageName}`}
                    </p>
                    {r.note && <p className="text-sm text-text-primary leading-relaxed">{r.note}</p>}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onEdit(contact)}>
              <Pencil size={16} /> Sửa
            </Button>
            <Button variant="danger" className="flex-1" onClick={() => setConfirmDelete(true)}>
              <Trash2 size={16} /> Xóa
            </Button>
          </div>
        </div>
      </Sheet>

      <ReviewFormSheet
        open={reviewFormOpen}
        onClose={() => setReviewFormOpen(false)}
        contactId={contact.id}
      />

      <ConfirmDialog
        open={confirmDelete}
        title="Xóa thầu/nhà cung cấp này?"
        description="Toàn bộ đánh giá liên quan cũng sẽ bị xóa. Hành động này không thể hoàn tác."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteContact(contact.id);
          setConfirmDelete(false);
          onClose();
          notify.success("Đã xóa");
        }}
      />

      <ConfirmDialog
        open={!!confirmDeleteReview}
        title="Xóa đánh giá này?"
        description="Hành động này không thể hoàn tác."
        onCancel={() => setConfirmDeleteReview(null)}
        onConfirm={() => {
          if (confirmDeleteReview) deleteContactReview(contact.id, confirmDeleteReview);
          setConfirmDeleteReview(null);
          notify.success("Đã xóa đánh giá");
        }}
      />
    </>
  );
}
