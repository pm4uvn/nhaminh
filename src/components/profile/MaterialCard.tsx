import { Badge } from "@/components/ui/Badge";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { formatCurrency } from "@/lib/format";
import { MATERIAL_STATUS_META } from "@/lib/meta";
import { Material } from "@/lib/types";

export function MaterialCard({ material, onClick }: { material: Material; onClick: () => void }) {
  const meta = MATERIAL_STATUS_META[material.status];
  return (
    <button onClick={onClick} className="text-left bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="h-28 w-full">
        <PhotoPlaceholder seed={material.photoSeed} src={material.photoUrl} className="h-full w-full" />
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold truncate">{material.name}</p>
        <p className="text-xs text-text-secondary truncate mt-0.5">{material.code}</p>
        {material.price !== undefined && (
          <p className="text-sm font-medium tabular-nums mt-1.5">{formatCurrency(material.price)}</p>
        )}
        <Badge tone={meta.tone} className="mt-2">
          {meta.label}
        </Badge>
      </div>
    </button>
  );
}
