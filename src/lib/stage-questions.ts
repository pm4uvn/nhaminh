export interface StageQuestion {
  id: string;
  text: string;
}

/**
 * Câu hỏi gợi ý nên hỏi thầu/thợ trước khi ký nhận hoặc thanh toán cho mỗi
 * giai đoạn — giúp người chưa có kinh nghiệm xây dựng biết cần kiểm tra gì,
 * tránh bỏ sót những điểm quan trọng. Gắn theo `stage.order`.
 */
export const STAGE_QUESTIONS: Record<number, StageQuestion[]> = {
  1: [
    { id: "q1-1", text: "Giấy phép xây dựng đã được duyệt đầy đủ chưa?" },
    { id: "q1-2", text: "Mốc ranh đất đã được xác định rõ ràng chưa?" },
    { id: "q1-3", text: "Thời gian dự kiến bắt đầu và hoàn thành giai đoạn tiếp theo là khi nào?" },
  ],
  2: [
    { id: "q2-1", text: "Kết quả khảo sát địa chất có đạt yêu cầu để làm móng không?" },
    { id: "q2-2", text: "Cốt thép móng đã được nghiệm thu trước khi đổ bê tông chưa?" },
    { id: "q2-3", text: "Mác bê tông sử dụng có đúng như trong hợp đồng/thiết kế không?" },
    { id: "q2-4", text: "Có biên bản nghiệm thu móng bằng văn bản không?" },
  ],
  3: [
    { id: "q3-1", text: "Kết cấu cột, dầm, sàn có đúng bản vẽ kỹ thuật không?" },
    { id: "q3-2", text: "Độ dày tường, loại gạch sử dụng có đúng thỏa thuận không?" },
    { id: "q3-3", text: "Có kiểm tra độ thẳng đứng, độ phẳng của tường/sàn không?" },
    { id: "q3-4", text: "Vật liệu tồn tại công trình có đúng số lượng, chủng loại đã thanh toán không?" },
  ],
  4: [
    { id: "q4-1", text: "Sơ đồ đi dây điện, đường ống nước đã được chụp ảnh lưu lại trước khi tô trát chưa?" },
    { id: "q4-2", text: "Đã kiểm tra áp lực nước, thông mạch điện trước khi che lấp chưa?" },
    { id: "q4-3", text: "Vị trí ổ cắm, công tắc có đúng với thiết kế nội thất dự kiến không?" },
    { id: "q4-4", text: "Vật tư điện nước sử dụng có đúng thương hiệu/chủng loại đã chọn không?" },
  ],
  5: [
    { id: "q5-1", text: "Lớp chống thấm đã được nghiệm thu trước khi lát gạch chưa?" },
    { id: "q5-2", text: "Màu sơn, loại gạch thực tế có đúng mẫu đã duyệt không?" },
    { id: "q5-3", text: "Các thiết bị vệ sinh, đèn điện đã chạy thử trước khi nghiệm thu chưa?" },
    { id: "q5-4", text: "Có hạng mục nào phát sinh ngoài hợp đồng cần làm rõ chi phí không?" },
  ],
  6: [
    { id: "q6-1", text: "Đã kiểm tra toàn bộ lỗi nhỏ (nứt, thấm, hở) trước khi ký nhận chưa?" },
    { id: "q6-2", text: "Hồ sơ bảo hành của các hạng mục/thiết bị đã được bàn giao đầy đủ chưa?" },
    { id: "q6-3", text: "Thời gian bảo hành tổng thể công trình là bao lâu?" },
    { id: "q6-4", text: "Đã thống nhất thời điểm thanh toán đợt cuối chưa?" },
  ],
};

export function getStageQuestions(order: number): StageQuestion[] {
  return STAGE_QUESTIONS[order] ?? [];
}
