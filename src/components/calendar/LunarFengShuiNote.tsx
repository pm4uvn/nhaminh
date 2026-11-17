import { CircleAlert } from "lucide-react";

export function LunarFengShuiNote() {
  return (
    <p className="flex items-start gap-1.5 text-xs text-text-secondary leading-relaxed">
      <CircleAlert size={13} className="mt-0.5 shrink-0" />
      Thông tin ngày tốt/xấu theo quan niệm dân gian, chỉ mang tính tham khảo — nên hỏi thêm
      người có kinh nghiệm hoặc chuyên gia phong thủy trước khi quyết định ngày động thổ, khởi
      công quan trọng.
    </p>
  );
}
