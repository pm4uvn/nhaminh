import { AppState } from "./types";
import { estimateCompletion, overallProgress, remainingBudget, stageProgress, totalPaid } from "./calculations";

/**
 * NHÀ MÌNH là ứng dụng chỉ chạy phía client (không có backend), nên link
 * chia sẻ không thể trỏ tới dữ liệu "sống" trên máy chủ. Thay vào đó, toàn
 * bộ nội dung xem-trước được đóng gói (snapshot) ngay trong chính URL —
 * link vẫn mở được trên bất kỳ máy/trình duyệt nào mà không cần đăng nhập
 * hay máy chủ, nhưng chỉ phản ánh đúng thời điểm lúc chia sẻ (không tự cập
 * nhật), và KHÔNG kèm ảnh thật (ảnh base64 sẽ khiến link quá dài, vượt giới
 * hạn độ dài URL của trình duyệt) — chỉ kèm mô tả ngắn của các mục nhật ký.
 */
export interface ShareSnapshot {
  v: 1;
  homeName: string;
  generatedAt: string; // ISO date
  progress: number;
  currentStageName?: string;
  stages: { name: string; status: string; progress: number }[];
  budget: number;
  paid: number;
  remaining: number;
  etaWeeks?: number;
  etaDate?: string;
  unresolvedIssuesCount: number;
  recentJournal: { date: string; caption: string }[];
}

const STATUS_LABEL: Record<string, string> = {
  todo: "Chưa bắt đầu",
  doing: "Đang thực hiện",
  done: "Hoàn thành",
};

export function buildShareSnapshot(state: AppState): ShareSnapshot {
  const { homeProfile, stages, expenses, journal } = state;
  const budget = homeProfile?.budget ?? 0;
  const estimate = estimateCompletion(stages, homeProfile?.startDate);
  const currentStage =
    stages.find((s) => s.status === "doing") ?? stages.slice().reverse().find((s) => s.status === "done");

  const unresolvedIssuesCount = journal.filter(
    (j) => j.isIssue && j.issueStatus !== "resolved"
  ).length;

  const recentJournal = [...journal]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5)
    .map((j) => ({ date: j.date, caption: j.caption }));

  return {
    v: 1,
    homeName: homeProfile?.name ?? "Nhà của tôi",
    generatedAt: new Date().toISOString().slice(0, 10),
    progress: overallProgress(stages),
    currentStageName: currentStage?.name,
    stages: stages.map((s) => ({
      name: s.name,
      status: STATUS_LABEL[s.status] ?? s.status,
      progress: stageProgress(s),
    })),
    budget,
    paid: totalPaid(expenses),
    remaining: remainingBudget(budget, expenses),
    etaWeeks: estimate.status === "ok" ? estimate.weeksRemaining : undefined,
    etaDate: estimate.status === "ok" ? estimate.estimatedDate : undefined,
    unresolvedIssuesCount,
    recentJournal,
  };
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function encodeShareSnapshot(snapshot: ShareSnapshot): string {
  const json = JSON.stringify(snapshot);
  const bytes = new TextEncoder().encode(json);
  return bytesToBase64Url(bytes);
}

export function decodeShareSnapshot(encoded: string): ShareSnapshot | null {
  try {
    const bytes = base64UrlToBytes(encoded);
    const json = new TextDecoder().decode(bytes);
    const data = JSON.parse(json);
    if (data && data.v === 1) return data as ShareSnapshot;
    return null;
  } catch {
    return null;
  }
}
