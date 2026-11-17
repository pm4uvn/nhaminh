import { documentCategoryMeta } from "@/lib/meta";
import { formatDate } from "@/lib/format";
import { DocumentRecord } from "@/lib/types";

export function DocumentCard({
  document,
  onClick,
}: {
  document: DocumentRecord;
  onClick: () => void;
}) {
  const meta = documentCategoryMeta(document.category);
  const Icon = meta.icon;
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 text-left active:bg-surface-2 rounded-xl px-1 -mx-1 transition-colors"
    >
      <div className="h-11 w-11 rounded-2xl bg-primary-light text-primary-dark flex items-center justify-center shrink-0">
        <Icon size={19} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium truncate">{document.name}</p>
        <p className="text-xs text-text-secondary mt-0.5">
          {meta.label} · {formatDate(document.addedDate)}
        </p>
      </div>
    </button>
  );
}
