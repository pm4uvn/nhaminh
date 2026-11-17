import {
  Contact,
  DocumentRecord,
  Expense,
  HomeProfile,
  JournalEntry,
  Material,
  Stage,
  Task,
} from "./types";

export const mockHomeProfile: HomeProfile = {
  id: "home-1",
  name: "Nhà của tôi",
  type: "new",
  budget: 1_500_000_000,
  startDate: "2026-07-01",
  createdAt: "2026-07-01",
  location: {
    lat: 10.8231,
    lng: 106.6297,
    address: "Quận Bình Thạnh, Thành phố Hồ Chí Minh",
  },
};

export const mockExpenses: Expense[] = [
  { id: "e1", amount: 120_000_000, description: "Đổ bê tông móng", category: "mong", date: "2026-08-12" },
  { id: "e2", amount: 180_000_000, description: "Nhân công xây tô", category: "tho", date: "2026-09-05" },
  { id: "e3", amount: 95_000_000, description: "Cát, đá, xi măng", category: "tho", date: "2026-09-20" },
  { id: "e4", amount: 85_000_000, description: "Vật tư điện nước", category: "dien_nuoc", date: "2026-10-10" },
  { id: "e5", amount: 45_000_000, description: "Nhân công lắp đặt điện nước", category: "dien_nuoc", date: "2026-10-15" },
  { id: "e6", amount: 20_000_000, description: "Gạch lát phòng khách", category: "hoan_thien", date: "2026-11-12" },
  { id: "e7", amount: 35_000_000, description: "Sơn nước ngoại thất", category: "hoan_thien", date: "2026-11-14" },
  { id: "e8", amount: 18_000_000, description: "Chống thấm sân thượng", category: "hoan_thien", date: "2026-11-16" },
  { id: "e9", amount: 150_000_000, description: "Đặt cọc tủ bếp", category: "noi_that", date: "2026-11-05" },
  { id: "e10", amount: 60_000_000, description: "Đặt cọc sofa phòng khách", category: "noi_that", date: "2026-11-08" },
  { id: "e11", amount: 25_000_000, description: "Chi phí xin phép xây dựng", category: "khac", date: "2026-08-01" },
  { id: "e12", amount: 17_000_000, description: "Phát sinh vận chuyển vật liệu", category: "khac", date: "2026-10-22" },
];

export const mockStages: Stage[] = [
  {
    id: "s1",
    order: 1,
    name: "Chuẩn bị",
    description: "Xin phép xây dựng và chuẩn bị mặt bằng",
    status: "done",
    startDate: "2026-07-01",
    endDate: "2026-07-20",
    checklist: [
      { id: "s1c1", title: "Xin phép xây dựng", done: true },
      { id: "s1c2", title: "Dọn dẹp mặt bằng", done: true },
    ],
    paymentConfirmed: true,
  },
  {
    id: "s2",
    order: 2,
    name: "Móng",
    description: "Khảo sát và thi công phần móng nhà",
    status: "done",
    startDate: "2026-07-21",
    endDate: "2026-08-15",
    checklist: [
      { id: "s2c1", title: "Khảo sát địa chất", done: true },
      { id: "s2c2", title: "Đổ bê tông móng", done: true },
      { id: "s2c3", title: "Nghiệm thu móng", done: true },
    ],
    paymentConfirmed: true,
  },
  {
    id: "s3",
    order: 3,
    name: "Phần thô",
    description: "Xây dựng khung và kết cấu chính của nhà",
    status: "done",
    startDate: "2026-08-16",
    endDate: "2026-09-25",
    checklist: [
      { id: "s3c1", title: "Xây tường", done: true },
      { id: "s3c2", title: "Đổ sàn các tầng", done: true },
      { id: "s3c3", title: "Lắp đà, cột", done: true },
      { id: "s3c4", title: "Cán nền", done: true },
    ],
    paymentConfirmed: true,
  },
  {
    id: "s4",
    order: 4,
    name: "Điện nước",
    description: "Lắp đặt hệ thống điện và cấp thoát nước",
    status: "done",
    startDate: "2026-09-26",
    endDate: "2026-10-20",
    checklist: [
      { id: "s4c1", title: "Đi dây điện âm tường", done: true },
      { id: "s4c2", title: "Lắp đường ống nước", done: true },
      { id: "s4c3", title: "Kiểm tra hệ thống điện nước", done: true },
    ],
    paymentConfirmed: true,
  },
  {
    id: "s5",
    order: 5,
    name: "Hoàn thiện",
    description: "Hoàn thiện nội ngoại thất trước khi bàn giao",
    status: "doing",
    startDate: "2026-10-21",
    checklist: [
      { id: "s5c1", title: "Chống thấm WC", done: true },
      { id: "s5c2", title: "Lát gạch", done: false },
      { id: "s5c3", title: "Sơn tường", done: false },
      { id: "s5c4", title: "Lắp cửa", done: false },
      { id: "s5c5", title: "Lắp thiết bị vệ sinh", done: false },
      { id: "s5c6", title: "Lắp đèn chiếu sáng", done: false },
    ],
  },
  {
    id: "s6",
    order: 6,
    name: "Bàn giao",
    description: "Nghiệm thu tổng thể và bàn giao nhà",
    status: "todo",
    checklist: [
      { id: "s6c1", title: "Nghiệm thu tổng thể", done: false },
      { id: "s6c2", title: "Bàn giao chìa khóa", done: false },
    ],
  },
];

export const mockJournal: JournalEntry[] = [
  {
    id: "j1",
    date: "2026-08-20",
    caption: "Đổ bê tông móng hoàn tất",
    type: "update",
    stageId: "s2",
    area: "Toàn bộ mặt bằng",
    photoSeed: "mong",
  },
  {
    id: "j2",
    date: "2026-09-10",
    caption: "Lên tường phần thô tầng 1",
    type: "update",
    stageId: "s3",
    area: "Tầng 1",
    photoSeed: "tho1",
  },
  {
    id: "j3",
    date: "2026-09-25",
    caption: "Phát hiện nứt nhẹ ở tường tầng 1",
    type: "issue",
    stageId: "s3",
    area: "Tầng 1",
    isIssue: true,
    issueStatus: "resolved",
    photoSeed: "crack",
    issueHistory: [
      { date: "2026-09-25", status: "new", note: "Mới phát hiện khi đi kiểm tra" },
      { date: "2026-09-28", status: "in_progress", note: "Thầu đã xử lý trám vá" },
      { date: "2026-10-02", status: "resolved", note: "Đã xử lý xong, không còn vết nứt" },
    ],
  },
  {
    id: "j4",
    date: "2026-10-12",
    caption: "Hoàn tất đi dây điện âm tường",
    type: "update",
    stageId: "s4",
    area: "Toàn bộ nhà",
    photoSeed: "dien",
  },
  {
    id: "j5",
    date: "2026-11-05",
    caption: "Thấm nước tại khu vực sân thượng",
    type: "issue",
    stageId: "s5",
    area: "Sân thượng",
    isIssue: true,
    issueStatus: "in_progress",
    photoSeed: "leak",
    issueHistory: [
      { date: "2026-11-05", status: "new", note: "Phát hiện thấm sau mưa lớn" },
      { date: "2026-11-09", status: "in_progress", note: "Đội thợ đang chống thấm lại" },
    ],
  },
  {
    id: "j6",
    date: "2026-11-12",
    caption: "Lát gạch khu vực cầu thang",
    type: "update",
    stageId: "s5",
    area: "Cầu thang",
    photoSeed: "stairs",
  },
  {
    id: "j7",
    date: "2026-11-15",
    caption: "Quyết định chọn màu sơn ấm cho phòng ngủ",
    type: "decision",
    stageId: "s5",
    area: "Phòng ngủ",
    photoSeed: "paint",
  },
  {
    id: "j8",
    date: "2026-11-16",
    caption: "Cửa chính bị kẹt sau khi lắp",
    type: "issue",
    stageId: "s5",
    area: "Cửa chính",
    isIssue: true,
    issueStatus: "new",
    photoSeed: "door",
    issueHistory: [
      { date: "2026-11-16", status: "new", note: "Cửa khó mở, cần thầu kiểm tra lại bản lề" },
    ],
  },
];

export const mockDocuments: DocumentRecord[] = [
  { id: "d1", name: "Bản vẽ thiết kế kiến trúc.pdf", category: "ban_ve", addedDate: "2026-07-15" },
  { id: "d2", name: "Hợp đồng thi công phần thô.pdf", category: "hop_dong", addedDate: "2026-08-01" },
  { id: "d3", name: "Biên bản nghiệm thu phần móng.pdf", category: "bien_ban", addedDate: "2026-08-25" },
  { id: "d4", name: "Báo giá vật liệu hoàn thiện.pdf", category: "bao_gia", addedDate: "2026-11-02" },
  { id: "d5", name: "Phiếu bảo hành thiết bị vệ sinh.pdf", category: "bao_hanh", addedDate: "2026-11-10" },
];

export const mockMaterials: Material[] = [
  { id: "m1", name: "Gạch phòng khách", code: "Viglacera HM803", supplier: "Viglacera", price: 350_000, status: "confirmed", photoSeed: "tile1" },
  { id: "m2", name: "Cửa nhôm mặt tiền", code: "Xingfa hệ 55", supplier: "Xingfa", price: 2_800_000, status: "considering", photoSeed: "door1" },
  { id: "m3", name: "Sơn nước ngoại thất", code: "Dulux Weathershield", supplier: "Dulux", price: 1_450_000, status: "confirmed", photoSeed: "paint1" },
  { id: "m4", name: "Thiết bị vệ sinh", code: "TOTO CS320", supplier: "TOTO", price: 4_200_000, status: "confirmed", photoSeed: "sanitary1" },
  { id: "m5", name: "Tủ bếp", code: "An Cường Laminate", supplier: "Nội thất An Cường", price: 85_000_000, status: "considering", photoSeed: "kitchen1" },
  { id: "m6", name: "Gạch ốp bếp", code: "Taicera 30x60", supplier: "Taicera", price: 180_000, status: "considering", photoSeed: "tile2" },
  { id: "m7", name: "Đèn chiếu sáng", code: "Rạng Đông LED âm trần", supplier: "Rạng Đông", price: 220_000, status: "confirmed", photoSeed: "light1" },
];

export const mockTasks: Task[] = [
  { id: "t1", title: "Xác nhận mẫu gạch phòng khách", dueLabel: "Hôm nay", done: false },
  { id: "t2", title: "Kiểm tra chống thấm WC", dueLabel: "Ngày mai", done: false },
  { id: "t3", title: "Thanh toán đợt tiếp theo cho thầu", dueLabel: "20/11/2026", done: false },
  { id: "t4", title: "Chọn màu sơn phòng ngủ", dueLabel: "25/11/2026", done: false },
];

export const mockContacts: Contact[] = [
  {
    id: "ct1",
    name: "Anh Tuấn",
    role: "Thầu chính",
    phone: "0901 234 567",
    reviews: [
      {
        id: "rv1",
        date: "2026-08-15",
        stageId: "s2",
        rating: 5,
        note: "Thi công móng đúng tiến độ, cẩn thận, nghiệm thu không có vấn đề gì.",
      },
      {
        id: "rv2",
        date: "2026-09-26",
        stageId: "s3",
        rating: 4,
        note: "Chất lượng phần thô tốt, nhưng báo tiến độ qua điện thoại hơi chậm.",
      },
    ],
  },
  {
    id: "ct2",
    name: "Anh Minh",
    role: "Thợ điện nước",
    phone: "0912 345 678",
    reviews: [
      {
        id: "rv3",
        date: "2026-10-21",
        stageId: "s4",
        rating: 3,
        note: "Làm xong đúng hạn nhưng có vài điểm đấu nối phải sửa lại sau khi kiểm tra.",
      },
    ],
  },
  {
    id: "ct3",
    name: "Chị Hoa",
    role: "Cung cấp gạch - Viglacera",
    phone: "0988 777 666",
    reviews: [
      {
        id: "rv4",
        date: "2026-11-12",
        stageId: "s5",
        rating: 5,
        note: "Giao hàng đúng hẹn, gạch đúng mẫu đã chọn, đóng gói cẩn thận.",
      },
    ],
  },
];
