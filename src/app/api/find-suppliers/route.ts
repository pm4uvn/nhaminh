import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { callGeminiWithFallback, extractGeminiText } from "@/lib/gemini-client";

// Google Search grounding tính phí/hạn mức riêng theo tài khoản (billing),
// không theo quota riêng từng model như chat/OCR thường — nên chỉ thử 2
// model thay vì toàn bộ chuỗi, tránh lặp vô ích khi 429 là do billing.
const SEARCH_MODEL_CHAIN = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite"];
const MAX_QUERY_LENGTH = 200;
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 5 * 60 * 1000;

const PROMPT_TEMPLATE = (query: string) => `Dùng công cụ tìm kiếm Google để tìm các nhà cung cấp/cửa hàng bán vật liệu xây dựng thực tế tại Việt Nam cho: "${query}".

Trả về CHÍNH XÁC một mảng JSON, không kèm giải thích, không markdown, tối đa 5 phần tử, theo đúng định dạng:
[{"name": "<tên cửa hàng/nhà cung cấp>", "address": "<địa chỉ hoặc khu vực, nếu biết>", "rating": <số sao trung bình 0-5, hoặc null nếu không tìm thấy>, "reviewCount": <số lượt đánh giá, hoặc null>, "priceRange": "<khoảng giá nếu tìm thấy trên trang, vd '150.000 - 200.000đ/viên', hoặc null nếu không chắc chắn>", "sourceUrl": "<đường dẫn trang nguồn>"}]

Chỉ điền rating/priceRange khi thực sự tìm thấy trên trang web, không suy đoán hay bịa số liệu. Nếu không tìm thấy kết quả phù hợp, trả về mảng rỗng [].`;

interface SupplierResult {
  name: string;
  address?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  priceRange?: string | null;
  sourceUrl?: string | null;
}

function extractJsonArray(text: string): SupplierResult[] | null {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) return null;
    return parsed
      .filter((item) => item && typeof item.name === "string")
      .map((item) => ({
        name: item.name,
        address: typeof item.address === "string" ? item.address : null,
        rating: typeof item.rating === "number" ? item.rating : null,
        reviewCount: typeof item.reviewCount === "number" ? item.reviewCount : null,
        priceRange: typeof item.priceRange === "string" ? item.priceRange : null,
        sourceUrl: typeof item.sourceUrl === "string" ? item.sourceUrl : null,
      }));
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const rate = checkRateLimit(getClientKey(req), RATE_LIMIT, RATE_WINDOW_MS);
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, message: `Bạn tìm hơi nhanh, thử lại sau ${rate.retryAfterSeconds} giây nhé.` },
      { status: 429 }
    );
  }

  let body: { query?: string; apiKey?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Yêu cầu không hợp lệ." }, { status: 400 });
  }

  const apiKey = (body.apiKey ?? "").trim() || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, code: "missing_key", message: "Chưa có Gemini API key. Vào Cài đặt để thêm key." },
      { status: 503 }
    );
  }

  const query = (body.query ?? "").trim().slice(0, MAX_QUERY_LENGTH);
  if (!query) {
    return NextResponse.json({ ok: false, message: "Thiếu từ khóa tìm kiếm." }, { status: 400 });
  }

  try {
    const result = await callGeminiWithFallback(
      apiKey,
      {
        contents: [{ role: "user", parts: [{ text: PROMPT_TEMPLATE(query) }] }],
        tools: [{ google_search: {} }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1000,
        },
      },
      SEARCH_MODEL_CHAIN
    );

    if (!result.ok) {
      console.error("Find-suppliers Gemini error:", result.status, result.errorText);
      if (result.status === 400 || result.status === 401 || result.status === 403) {
        return NextResponse.json(
          { ok: false, code: "invalid_key", message: "API key không hợp lệ. Kiểm tra lại trong Cài đặt." },
          { status: 502 }
        );
      }
      if (result.status === 429) {
        return NextResponse.json(
          {
            ok: false,
            code: "quota_exceeded",
            message:
              "Tính năng tìm kiếm Google trên Gemini cần bật thanh toán (billing) riêng trên tài khoản Google AI Studio của key này — khác với giới hạn chat/OCR thông thường. Kiểm tra tại aistudio.google.com/docs/rate-limits.",
          },
          { status: 502 }
        );
      }
      return NextResponse.json(
        { ok: false, message: "Không tìm kiếm được lúc này, thử lại sau." },
        { status: 502 }
      );
    }

    const text = extractGeminiText(result.data);
    const results = text ? extractJsonArray(text) : null;

    if (!results) {
      return NextResponse.json({
        ok: false,
        message: "Không tìm được kết quả phù hợp, thử từ khóa khác nhé.",
      });
    }

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error("Find-suppliers route error:", err);
    return NextResponse.json(
      { ok: false, message: "Không thể kết nối để tìm kiếm lúc này." },
      { status: 502 }
    );
  }
}
