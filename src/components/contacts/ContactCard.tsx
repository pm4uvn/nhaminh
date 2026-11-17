import { Phone, User } from "lucide-react";
import { Contact } from "@/lib/types";
import { StarRating, averageRating } from "./StarRating";

export function ContactCard({ contact, onClick }: { contact: Contact; onClick: () => void }) {
  const avg = averageRating(contact.reviews);
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 text-left active:bg-surface-2 rounded-xl px-1 -mx-1 transition-colors"
    >
      <div className="h-11 w-11 rounded-2xl bg-primary-light text-primary-dark flex items-center justify-center shrink-0">
        <User size={19} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium truncate">{contact.name}</p>
        <p className="text-xs text-text-secondary truncate mt-0.5">{contact.role}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        {contact.reviews.length > 0 ? (
          <StarRating rating={avg} size={13} />
        ) : (
          <span className="text-xs text-text-secondary">Chưa đánh giá</span>
        )}
        {contact.phone && (
          <span className="flex items-center gap-1 text-xs text-text-secondary">
            <Phone size={11} /> {contact.phone}
          </span>
        )}
      </div>
    </button>
  );
}
