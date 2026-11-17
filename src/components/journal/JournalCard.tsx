import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { formatDate } from "@/lib/format";
import { JournalEntry } from "@/lib/types";
import { ISSUE_STATUS_META, journalTypeMeta } from "@/lib/meta";

export function JournalCard({
  entry,
  onClick,
}: {
  entry: JournalEntry;
  onClick: () => void;
}) {
  const typeMeta = journalTypeMeta(entry.type);
  const Icon = typeMeta.icon;

  return (
    <Card className="overflow-hidden">
      <button onClick={onClick} className="w-full text-left">
        <div className="h-44 w-full">
          <PhotoPlaceholder
            seed={entry.photoSeed}
            src={entry.photoUrl}
            className="h-full w-full"
            iconSize={28}
          />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs text-text-secondary">{formatDate(entry.date)}</span>
            {entry.area && (
              <>
                <span className="text-text-secondary">·</span>
                <span className="text-xs text-text-secondary">{entry.area}</span>
              </>
            )}
          </div>
          <p className="font-medium text-[15px] mb-2 leading-snug">{entry.caption}</p>
          <div className="flex items-center gap-2">
            <Badge tone="neutral">
              <Icon size={12} /> {typeMeta.label}
            </Badge>
            {entry.isIssue && entry.issueStatus && (
              <Badge tone={ISSUE_STATUS_META[entry.issueStatus].tone}>
                {ISSUE_STATUS_META[entry.issueStatus].label}
              </Badge>
            )}
          </div>
        </div>
      </button>
    </Card>
  );
}
