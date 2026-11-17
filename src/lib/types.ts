export type ProjectType = "new" | "renovate" | "interior";

export interface HomeLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface HomeProfile {
  id: string;
  name: string;
  type: ProjectType;
  budget: number;
  startDate?: string; // ISO date
  createdAt: string; // ISO date
  location?: HomeLocation;
}

export type ExpenseCategory =
  | "mong"
  | "tho"
  | "dien_nuoc"
  | "hoan_thien"
  | "noi_that"
  | "khac";

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string; // ISO date
  note?: string;
  attachmentName?: string;
}

export type StageStatus = "todo" | "doing" | "done";

export interface ChecklistItem {
  id: string;
  title: string;
  done: boolean;
  isCustom?: boolean;
}

export interface Stage {
  id: string;
  order: number;
  name: string;
  description: string;
  status: StageStatus;
  startDate?: string;
  endDate?: string;
  note?: string;
  checklist: ChecklistItem[];
  /** Người dùng đã xác nhận thanh toán đợt gắn với giai đoạn này */
  paymentConfirmed?: boolean;
  /** id của các câu hỏi gợi ý (xem lib/stage-questions.ts) đã hỏi thầu */
  askedQuestionIds?: string[];
}

export type JournalEntryType = "update" | "note" | "issue" | "decision";
export type IssueStatus = "new" | "in_progress" | "resolved";

export interface JournalEntry {
  id: string;
  date: string; // ISO date
  caption: string;
  type: JournalEntryType;
  photoSeed?: string; // used to render a deterministic placeholder photo
  photoUrl?: string; // data URL of a user-picked photo, takes priority over photoSeed
  stageId?: string;
  area?: string;
  isIssue?: boolean;
  issueStatus?: IssueStatus;
  issueHistory?: { date: string; status: IssueStatus; note?: string }[];
}

export type DocumentCategory =
  | "ban_ve"
  | "hop_dong"
  | "bao_gia"
  | "bien_ban"
  | "bao_hanh"
  | "khac";

export interface DocumentRecord {
  id: string;
  name: string;
  category: DocumentCategory;
  addedDate: string; // ISO date
}

export type MaterialStatus = "considering" | "confirmed";

export interface Material {
  id: string;
  name: string;
  code: string;
  supplier?: string;
  price?: number;
  status: MaterialStatus;
  photoSeed?: string;
  photoUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  dueLabel?: string;
  done: boolean;
}

export interface ContactReview {
  id: string;
  date: string; // ISO date
  stageId?: string;
  rating: number; // 1-5
  note?: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string; // vd: "Thầu chính", "Thợ điện nước", "Cung cấp gạch"
  phone?: string;
  reviews: ContactReview[];
}

/** Các mốc "sắp bị che kín" cần lưu bằng chứng trước khi thi công tiếp */
export type CheckpointType =
  | "before_concrete"
  | "before_plaster"
  | "before_ceiling"
  | "before_tiling";

export interface PhotoPin {
  id: string;
  x: number; // % từ trái, 0-100
  y: number; // % từ trên, 0-100
  label: string;
  note?: string; // vd kích thước, khoảng cách tới mốc cố định
}

export interface Room {
  id: string;
  name: string;
}

export interface EvidenceRecord {
  id: string;
  roomId: string;
  checkpointType: CheckpointType;
  photoUrl?: string;
  photoSeed?: string; // dùng khi chưa có ảnh thật (demo)
  pins: PhotoPin[];
  date: string; // ISO date
  confirmedBy?: string;
}

export interface AppState {
  onboardingDone: boolean;
  homeProfile: HomeProfile | null;
  expenses: Expense[];
  stages: Stage[];
  journal: JournalEntry[];
  documents: DocumentRecord[];
  materials: Material[];
  tasks: Task[];
  contacts: Contact[];
  rooms: Room[];
  evidenceRecords: EvidenceRecord[];
}
