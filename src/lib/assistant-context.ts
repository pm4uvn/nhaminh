import { AppState } from "./types";
import {
  budgetPace,
  completedStagesCount,
  estimateCompletion,
  monthlyExpenseTotals,
  overallProgress,
  remainingBudget,
  stageProgress,
  totalPaid,
} from "./calculations";
import { getPaymentReminders } from "./payment-schedule";
import { formatCurrency, formatDate } from "./format";
import { STAGE_STATUS_META } from "./meta";

/**
 * Tóm tắt dữ liệu thực của dự án thành văn bản tiếng Việt ngắn gọn, dùng làm
 * ngữ cảnh (context) cho trợ lý — không gửi thông tin định danh không cần
 * thiết (vị trí nhà, địa chỉ cụ thể) lên bên thứ ba.
 */
export function buildAssistantContext(state: AppState): string {
  const { homeProfile, stages, expenses, journal, tasks } = state;
  const budget = homeProfile?.budget ?? 0;
  const lines: string[] = [];

  lines.push(`Loại dự án: ${PROJECT_TYPE_LABEL[homeProfile?.type ?? "new"]}.`);
  if (homeProfile?.startDate) {
    lines.push(`Ngày bắt đầu thi công: ${formatDate(homeProfile.startDate)}.`);
  }

  const progress = overallProgress(stages);
  const done = completedStagesCount(stages);
  lines.push(
    `Tiến độ tổng thể: ${progress}% (${done}/${stages.length} giai đoạn đã hoàn thành).`
  );
  lines.push(
    "Chi tiết từng giai đoạn: " +
      stages
        .map(
          (s) =>
            `${s.name} (${STAGE_STATUS_META[s.status].label}, ${stageProgress(s)}% việc trong giai đoạn đã xong)`
        )
        .join("; ") +
      "."
  );

  const estimate = estimateCompletion(stages, homeProfile?.startDate);
  if (estimate.status === "ok" && estimate.weeksRemaining && estimate.estimatedDate) {
    lines.push(
      `Ước tính còn khoảng ${estimate.weeksRemaining} tuần nữa để hoàn thành, dự kiến xong vào khoảng ${formatDate(estimate.estimatedDate)}.`
    );
  } else if (estimate.status === "completed") {
    lines.push("Mọi việc trong danh sách đã hoàn thành.");
  }

  const paid = totalPaid(expenses);
  const remaining = remainingBudget(budget, expenses);
  lines.push(
    `Ngân sách dự kiến: ${formatCurrency(budget)}. Đã thanh toán: ${formatCurrency(paid)}. Còn lại: ${formatCurrency(remaining)}.`
  );

  const pace = budgetPace(stages, budget, expenses);
  if (pace.level === "ahead_spending") {
    lines.push(
      "Cảnh báo: tốc độ chi tiêu đang nhanh hơn tốc độ thi công — có khả năng vượt ngân sách nếu tiếp tục."
    );
  } else if (pace.level === "over_budget") {
    lines.push("Cảnh báo: số tiền đã chi đã bằng hoặc vượt ngân sách dự kiến.");
  } else if (pace.level === "ok") {
    lines.push("Tốc độ chi tiêu hiện đang phù hợp với tiến độ thi công, chưa có dấu hiệu vượt ngân sách.");
  }

  const months = monthlyExpenseTotals(expenses, 3);
  lines.push(
    "Chi phí theo tháng gần đây: " +
      months.map((m) => `${m.label}: ${formatCurrency(m.total)}`).join("; ") +
      "."
  );

  const reminders = getPaymentReminders(stages, budget);
  if (reminders.length > 0) {
    lines.push(
      "Nhắc thanh toán đang chờ: " +
        reminders
          .map(
            (r) =>
              `${r.stage.name} (${r.kind === "due" ? "đã xong, nên thanh toán" : "sắp xong"}, khoảng ${formatCurrency(r.amount)})`
          )
          .join("; ") +
        "."
    );
  } else {
    lines.push("Hiện không có khoản thanh toán nào đang chờ xác nhận.");
  }

  const unresolvedIssues = journal.filter((j) => j.isIssue && j.issueStatus !== "resolved");
  if (unresolvedIssues.length > 0) {
    lines.push(
      `Có ${unresolvedIssues.length} vấn đề/sự cố chưa giải quyết: ` +
        unresolvedIssues.map((j) => j.caption).join("; ") +
        "."
    );
  } else {
    lines.push("Không có vấn đề/sự cố nào đang chờ xử lý.");
  }

  const pendingTasks = tasks.filter((t) => !t.done);
  if (pendingTasks.length > 0) {
    lines.push("Việc cần làm chưa xong: " + pendingTasks.map((t) => t.title).join("; ") + ".");
  } else {
    lines.push("Không có việc cần làm nào đang chờ.");
  }

  return lines.join("\n");
}

const PROJECT_TYPE_LABEL: Record<string, string> = {
  new: "Xây nhà mới",
  renovate: "Sửa chữa / cải tạo",
  interior: "Hoàn thiện nội thất",
};
