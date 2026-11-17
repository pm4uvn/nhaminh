import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

const GEMINI_MODEL = "gemini-flash-lite-latest";
const MAX_IMAGE_BASE64_LENGTH = 6_000_000; // ~4.5MB ảnh gốc, đủ cho ảnh chụp hóa đơn
const RATE_LIMIT = 10; // lượt / cửa sổ — ảnh tốn chi phí hơn câu hỏi text
const RATE_WINDOW_MS = 5 * 60 * 1000; // 5 phút

const PROMPT = `Đây là ảnh hóa đơn hoặc biên lai chi phí xây nhà. Đọc và trả về CHÍNH XÁC một đối tượng JSON, không kèm giải thích, không markdown, theo đúng định dạng:
{"amount": <số tiền tổng cộng, là số nguyên VNĐ, không có dấu chấm/phẩy/ký hiệu>, "description": "<mô tả ngắn gọn, ví dụ tên cửa hàng hoặc mặt hàng chính, tối đa 8 từ>"}
Nếu không đọc được số tiền rõ ràng, trả về {"amount": null, "description": null}.`;

function extractJson(text: string): { amount: number | null; description: string | null } | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    const amount =
      typeof parsed.amount === "number" && Number.isFinite(parsed.amount) ? parsed.amount : null;
    const description = typeof parsed.description === "string" ? parsed.description : null;
    return { amount, description };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const rate = checkRateLimit(getClientKey(req), RATE_LIMIT, RATE_WINDOW_MS);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        ok: false,
        message: `Bạn quét hơi nhanh, thử lại sau ${rate.retryAfterSeconds} giây nhé.`,
      },
      { status: 429 }
    );
  }

  let body: { imageBase64?: string; mimeType?: string; apiKey?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Yêu cầu không hợp lệ." },
      { status: 400 }
    );
  }

  const apiKey = (body.apiKey ?? "").trim() || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, code: "missing_key", message: "Chưa có Gemini API key. Vào Cài đặt để thêm key." },
      { status: 503 }
    );
  }

  const imageBase64 = body.imageBase64 ?? "";
  const mimeType = body.mimeType ?? "image/jpeg";
  if (!imageBase64 || imageBase64.length > MAX_IMAGE_BASE64_LENGTH) {
    return NextResponse.json(
      { ok: false, message: "Ảnh không hợp lệ hoặc quá lớn." },
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
          contents: [
            {
              role: "user",
              parts: [
                { text: PROMPT },
                { inline_data: { mime_type: mimeType, data: imageBase64 } },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 200,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("OCR Gemini error:", res.status, errText);
      return NextResponse.json(
        { ok: false, message: "Không nhận diện được hóa đơn lúc này." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = text ? extractJson(text) : null;

    if (!parsed || parsed.amount === null) {
      return NextResponse.json({
        ok: false,
        message: "Không đọc được số tiền trên hóa đơn này, bạn nhập tay giúp nhé.",
      });
    }

    return NextResponse.json({
      ok: true,
      amount: Math.round(parsed.amount),
      description: parsed.description ?? undefined,
    });
  } catch (err) {
    console.error("OCR route error:", err);
    return NextResponse.json(
      { ok: false, message: "Không thể kết nối để nhận diện hóa đơn." },
      { status: 502 }
    );
  }
}
