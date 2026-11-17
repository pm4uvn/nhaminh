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

export interface AppState {
  onboardingDone: boolean;
  homeProfile: HomeProfile | null;
  expenses: Expense[];
  stages: Stage[];
  journal: JournalEntry[];
  documents: DocumentRecord[];
  materials: Material[];
  tasks: Task[];
}
