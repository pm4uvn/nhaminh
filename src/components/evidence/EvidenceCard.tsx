import { EvidenceRecord, Room } from "@/lib/types";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Badge } from "@/components/ui/Badge";
import { CHECKPOINT_META } from "@/lib/checkpoints";
import { formatDate } from "@/lib/format";

export function EvidenceCard({
  record,
  room,
  onClick,
}: {
  record: EvidenceRecord;
  room?: Room;
  onClick: () => void;
}) {
  const meta = CHECKPOINT_META[record.checkpointType];
  const Icon = meta.icon;
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 py-3 text-left">
      <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0">
        <PhotoPlaceholder
          src={record.photoUrl}
          seed={record.photoSeed ?? record.checkpointType}
          className="h-full w-full"
          iconSize={18}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium truncate">{room?.name ?? "Chưa gắn phòng"}</p>
        <p className="text-xs text-text-secondary mt-0.5">
          {formatDate(record.date)} · {record.pins.length} vị trí đã ghim
        </p>
      </div>
      <Badge tone="primary">
        <Icon size={12} /> {meta.label}
      </Badge>
    </button>
  );
}
