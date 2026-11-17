import { Waves, Hammer, Layers, Grid2x2, LucideIcon } from "lucide-react";
import { CheckpointType } from "./types";

export const CHECKPOINT_META: Record<CheckpointType, { label: string; icon: LucideIcon }> = {
  before_concrete: { label: "Trước khi đổ bê tông", icon: Layers },
  before_plaster: { label: "Trước khi tô tường", icon: Hammer },
  before_ceiling: { label: "Trước khi đóng trần", icon: Grid2x2 },
  before_tiling: { label: "Trước khi lát nền", icon: Waves },
};

export const CHECKPOINT_ORDER: CheckpointType[] = [
  "before_concrete",
  "before_plaster",
  "before_ceiling",
  "before_tiling",
];

/**
 * Khớp tiêu đề việc trong checklist (lib/mock-data.ts) với mốc "sắp che kín"
 * tương ứng, để nhắc người dùng lưu ảnh bằng chứng trước khi tích hoàn
 * thành việc đó — đây chính là thời điểm cuối cùng còn nhìn thấy được.
 */
export const CHECKLIST_CHECKPOINT_TRIGGERS: { keyword: string; checkpoint: CheckpointType }[] = [
  { keyword: "xây tường", checkpoint: "before_plaster" },
  { keyword: "đi dây điện âm tường", checkpoint: "before_plaster" },
  { keyword: "cán nền", checkpoint: "before_tiling" },
  { keyword: "lát gạch", checkpoint: "before_tiling" },
  { keyword: "đổ bê tông", checkpoint: "before_concrete" },
  { keyword: "đổ sàn", checkpoint: "before_concrete" },
];

export function matchCheckpointForChecklistTitle(title: string): CheckpointType | null {
  const lower = title.toLowerCase();
  const match = CHECKLIST_CHECKPOINT_TRIGGERS.find((t) => lower.includes(t.keyword));
  return match?.checkpoint ?? null;
}
