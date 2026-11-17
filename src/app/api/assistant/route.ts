import { NextRequest, NextResponse } from "next/server";

const GEMINI_MODEL = "gemini-2.0-flash";
const MAX_QUESTION_LENGTH = 500;

const SYSTEM_PROMPT_HEADER = `Bạn là trợ lý của ứng dụng "Nhà Mình", giúp một người đang xây/sửa nhà lần đầu, không có chuyên môn xây dựng, hiểu rõ tình hình ngôi nhà của chính họ.

QUY TẮC:
- Chỉ trả lời dựa trên "DỮ LIỆU DỰ ÁN" được cung cấp dưới đây. Không bịa thêm số liệu không có trong dữ liệu.
- Nếu không đủ dữ liệu để trả lời chắc chắn, hãy nói rõ là không có đủ thông tin, đừng đoán.
- Trả lời ngắn gọn (2-4 câu), bằng tiếng Việt đời thường, dễ hiểu, giọng điệu ấm áp, trấn an — không dùng thuật ngữ xây dựng khó hiểu.
- Không đưa ra tư vấn pháp lý, kỹ thuật kết cấu, hoặc tài chính chuyên sâu — chỉ tóm tắt và nhận xét dựa trên dữ liệu.
- Nếu câu hỏi không liên quan đến ngôi nhà/dự án này, hãy lịch sự nói rằng bạn chỉ hỗ trợ các câu hỏi về dự án xây nhà của người dùng.

DỮ LIỆU DỰ ÁN:
`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, code: "missing_key", message: "Chưa thiết lập GEMINI_API_KEY trên server." },
      { status: 503 }
    );
  }

  let body: { question?: string; context?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "bad_request", message: "Yêu cầu không hợp lệ." },
      { status: 400 }
    );
  }

  const question = (body.question ?? "").trim().slice(0, MAX_QUESTION_LENGTH);
  const context = (body.context ?? "").trim();

  if (!question) {
    return NextResponse.json(
      { ok: false, code: "bad_request", message: "Thiếu câu hỏi." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT_HEADER + context }],
          },
          contents: [{ role: "user", parts: [{ text: question }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 400,
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API error:", res.status, errText);
      return NextResponse.json(
        {
          ok: false,
          code: "upstream_error",
          message: "Trợ lý đang gặp sự cố kết nối, vui lòng thử lại sau.",
        },
        { status: 502 }
      );
    }

    const data = await res.json();
    const answer: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!answer) {
      const blockReason = data?.promptFeedback?.blockReason;
      return NextResponse.json(
        {
          ok: false,
          code: "no_answer",
          message: blockReason
            ? "Câu hỏi này trợ lý không thể trả lời được."
            : "Trợ lý chưa thể trả lời câu này, bạn thử hỏi cách khác nhé.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ ok: true, answer: answer.trim() });
  } catch (err) {
    console.error("Assistant route error:", err);
    return NextResponse.json(
      { ok: false, code: "network_error", message: "Không thể kết nối tới trợ lý lúc này." },
      { status: 502 }
    );
  }
}
