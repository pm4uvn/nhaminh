import {
  Layers,
  Blocks,
  Droplets,
  Zap,
  ClipboardCheck,
  PaintRoller,
  DoorOpen,
  Lightbulb,
  KeyRound,
  Waves,
  Columns,
  BrickWall,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";

export interface GlossaryTerm {
  id: string;
  label: string; // hiển thị trong popup, viết hoa chữ đầu
  aliases: string[]; // các cách viết có thể gặp trong nội dung, chữ thường
  definition: string;
  example?: string;
  icon: LucideIcon;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: "mat_bang",
    label: "Mặt bằng",
    aliases: ["mặt bằng"],
    definition:
      "Toàn bộ khu đất nơi ngôi nhà sẽ được xây. \"Dọn dẹp mặt bằng\" nghĩa là phát quang, dọn sạch đất trước khi khởi công.",
    icon: Layers,
  },
  {
    id: "dia_chat",
    label: "Khảo sát địa chất",
    aliases: ["khảo sát địa chất", "địa chất"],
    definition:
      "Việc kiểm tra độ cứng, độ lún của đất nền trước khi đổ móng, để biết cần làm móng kiểu gì cho chắc.",
    icon: Layers,
  },
  {
    id: "mong",
    label: "Móng",
    aliases: ["móng nhà", "phần móng", "móng"],
    definition:
      "Phần kết cấu nằm sâu dưới đất, chịu toàn bộ tải trọng ngôi nhà. Móng yếu là nguyên nhân phổ biến gây nứt, lún nhà về sau.",
    icon: Layers,
  },
  {
    id: "be_tong",
    label: "Bê tông",
    aliases: ["đổ bê tông", "bê tông"],
    definition:
      "Hỗn hợp cát, đá, xi măng và nước trộn lại rồi đổ vào khuôn (móng, cột, sàn...), khi khô sẽ cứng như đá — tạo nên khung chịu lực của nhà.",
    icon: Blocks,
  },
  {
    id: "nghiem_thu",
    label: "Nghiệm thu",
    aliases: ["nghiệm thu tổng thể", "nghiệm thu"],
    definition:
      "Bước kiểm tra lại phần việc vừa thi công để xác nhận đạt chất lượng, trước khi chuyển giai đoạn hoặc thanh toán cho thầu.",
    icon: ClipboardCheck,
  },
  {
    id: "phan_tho",
    label: "Phần thô",
    aliases: ["phần thô"],
    definition:
      "Giai đoạn xây khung chính của nhà: tường, cột, sàn, dầm — chưa sơn, chưa lát gạch, chưa có nội thất.",
    icon: Columns,
  },
  {
    id: "xay_tuong",
    label: "Xây tường",
    aliases: ["xây tường", "sơn tường"],
    definition:
      "Dùng gạch và vữa xếp thành các bức tường để ngăn chia không gian trong nhà.",
    icon: BrickWall,
  },
  {
    id: "da_cot",
    label: "Đà, cột",
    aliases: ["đà, cột", "lắp đà", "cột"],
    definition:
      "Đà (dầm) và cột là hệ khung chịu lực chính, giống như \"xương\" của ngôi nhà, đỡ sàn và tường phía trên.",
    icon: Columns,
  },
  {
    id: "can_nen",
    label: "Cán nền",
    aliases: ["cán nền"],
    definition:
      "Đổ và làm phẳng một lớp vữa mỏng trên mặt sàn thô, để chuẩn bị cho việc lát gạch hoặc hoàn thiện sàn phía trên.",
    icon: Layers,
  },
  {
    id: "am_tuong",
    label: "Đi âm tường",
    aliases: ["âm tường"],
    definition:
      "Lắp đường dây điện hoặc ống nước chạy ngầm trong tường/sàn, để khi hoàn thiện sẽ không thấy dây hay ống lộ ra ngoài.",
    icon: Zap,
  },
  {
    id: "chong_tham",
    label: "Chống thấm",
    aliases: ["chống thấm"],
    definition:
      "Phủ một lớp vật liệu đặc biệt lên sàn, tường (thường ở WC, sân thượng, mái) để ngăn nước thấm vào bên trong, gây ẩm mốc, bong tróc về sau.",
    icon: Droplets,
  },
  {
    id: "ban_giao",
    label: "Bàn giao",
    aliases: ["bàn giao chìa khóa", "bàn giao nhà", "bàn giao"],
    definition:
      "Thời điểm thầu thi công chính thức trao lại ngôi nhà đã hoàn thành cho gia chủ, thường kèm nghiệm thu lần cuối.",
    icon: KeyRound,
  },
  {
    id: "thiet_bi_ve_sinh",
    label: "Thiết bị vệ sinh",
    aliases: ["thiết bị vệ sinh"],
    definition:
      "Các vật dụng lắp trong nhà tắm/WC như bồn cầu, lavabo, vòi sen, vòi rửa...",
    icon: Waves,
  },
  {
    id: "den_chieu_sang",
    label: "Đèn chiếu sáng",
    aliases: ["đèn chiếu sáng", "lắp đèn"],
    definition: "Hệ thống đèn điện được lắp đặt để chiếu sáng cho từng khu vực trong nhà.",
    icon: Lightbulb,
  },
  {
    id: "lap_cua",
    label: "Lắp cửa",
    aliases: ["lắp cửa"],
    definition: "Gắn cửa chính, cửa phòng, cửa sổ vào các khung đã chuẩn bị sẵn trong phần thô.",
    icon: DoorOpen,
  },
  {
    id: "son_ngoai_that",
    label: "Sơn ngoại thất",
    aliases: ["sơn nước ngoại thất", "sơn ngoại thất"],
    definition:
      "Lớp sơn phủ bên ngoài nhà, vừa tạo màu sắc vừa giúp bảo vệ tường khỏi mưa nắng, ẩm mốc.",
    icon: PaintRoller,
  },
  {
    id: "bao_hanh",
    label: "Bảo hành",
    aliases: ["bảo hành"],
    definition:
      "Cam kết của nhà cung cấp/thầu sẽ sửa chữa miễn phí nếu vật liệu hoặc thi công gặp lỗi trong một khoảng thời gian nhất định sau khi lắp đặt.",
    icon: ShieldCheck,
  },
];

export function getGlossaryTerm(id: string): GlossaryTerm | undefined {
  return GLOSSARY.find((t) => t.id === id);
}

// Sắp xếp theo độ dài alias giảm dần để ưu tiên khớp cụm từ dài trước (vd "cán nền" trước "nền")
const MATCHERS = GLOSSARY.flatMap((term) =>
  term.aliases.map((alias) => ({ termId: term.id, alias }))
).sort((a, b) => b.alias.length - a.alias.length);

export interface GlossarySegment {
  text: string;
  termId?: string;
}

export function splitWithGlossary(text: string): GlossarySegment[] {
  const lower = text.toLowerCase();
  const matches: { start: number; end: number; termId: string }[] = [];

  for (const { termId, alias } of MATCHERS) {
    let fromIndex = 0;
    while (fromIndex <= lower.length) {
      const idx = lower.indexOf(alias, fromIndex);
      if (idx === -1) break;
      const end = idx + alias.length;
      const overlaps = matches.some((m) => idx < m.end && end > m.start);
      if (!overlaps) {
        matches.push({ start: idx, end, termId });
      }
      fromIndex = end;
    }
  }

  matches.sort((a, b) => a.start - b.start);

  const segments: GlossarySegment[] = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.start > cursor) {
      segments.push({ text: text.slice(cursor, m.start) });
    }
    segments.push({ text: text.slice(m.start, m.end), termId: m.termId });
    cursor = m.end;
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor) });
  }
  return segments;
}
