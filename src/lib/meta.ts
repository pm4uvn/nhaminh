import {
  Banknote,
  Blocks,
  Droplets,
  FileText,
  FileSignature,
  FileCheck2,
  ShieldCheck,
  Sofa,
  Sparkles,
  MoreHorizontal,
  LucideIcon,
  ClipboardList,
  StickyNote,
  AlertTriangle,
  Lightbulb,
  Building2,
} from "lucide-react";
import {
  DocumentCategory,
  ExpenseCategory,
  IssueStatus,
  JournalEntryType,
  MaterialStatus,
  StageStatus,
} from "./types";

export const EXPENSE_CATEGORIES: {
  value: ExpenseCategory;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "mong", label: "Phần móng", icon: Building2 },
  { value: "tho", label: "Phần thô", icon: Blocks },
  { value: "dien_nuoc", label: "Điện nước", icon: Droplets },
  { value: "hoan_thien", label: "Hoàn thiện", icon: Sparkles },
  { value: "noi_that", label: "Nội thất", icon: Sofa },
  { value: "khac", label: "Khác", icon: MoreHorizontal },
];

export function expenseCategoryMeta(value: ExpenseCategory) {
  return EXPENSE_CATEGORIES.find((c) => c.value === value) ?? EXPENSE_CATEGORIES[5];
}

export const DOCUMENT_CATEGORIES: {
  value: DocumentCategory;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "ban_ve", label: "Bản vẽ", icon: FileSignature },
  { value: "hop_dong", label: "Hợp đồng", icon: FileText },
  { value: "bao_gia", label: "Báo giá", icon: Banknote },
  { value: "bien_ban", label: "Biên bản", icon: FileCheck2 },
  { value: "bao_hanh", label: "Bảo hành", icon: ShieldCheck },
  { value: "khac", label: "Khác", icon: MoreHorizontal },
];

export function documentCategoryMeta(value: DocumentCategory) {
  return DOCUMENT_CATEGORIES.find((c) => c.value === value) ?? DOCUMENT_CATEGORIES[5];
}

export const JOURNAL_TYPES: {
  value: JournalEntryType;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "update", label: "Cập nhật thi công", icon: ClipboardList },
  { value: "note", label: "Ghi chú", icon: StickyNote },
  { value: "issue", label: "Sự cố", icon: AlertTriangle },
  { value: "decision", label: "Quyết định", icon: Lightbulb },
];

export function journalTypeMeta(value: JournalEntryType) {
  return JOURNAL_TYPES.find((t) => t.value === value) ?? JOURNAL_TYPES[0];
}

export const ISSUE_STATUS_META: Record<
  IssueStatus,
  { label: string; tone: "warning" | "primary" | "success" }
> = {
  new: { label: "Mới ghi nhận", tone: "warning" },
  in_progress: { label: "Đang xử lý", tone: "primary" },
  resolved: { label: "Đã giải quyết", tone: "success" },
};

export const MATERIAL_STATUS_META: Record<
  MaterialStatus,
  { label: string; tone: "warning" | "success" }
> = {
  considering: { label: "Đang cân nhắc", tone: "warning" },
  confirmed: { label: "Đã chốt", tone: "success" },
};

export const STAGE_STATUS_META: Record<
  StageStatus,
  { label: string; tone: "neutral" | "primary" | "success" }
> = {
  todo: { label: "Chưa bắt đầu", tone: "neutral" },
  doing: { label: "Đang thực hiện", tone: "primary" },
  done: { label: "Hoàn thành", tone: "success" },
};
