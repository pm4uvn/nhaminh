/**
 * Danh sách model Gemini dùng cho các route text-out (chat, OCR, tìm kiếm),
 * theo đúng các model thực tế đang khả dụng trên tài khoản (xem bảng quota
 * aistudio.google.com/docs/rate-limits) — ưu tiên model có hạn mức
 * lượt/ngày (RPD) cao nhất trước, vì mỗi model có pool quota RIÊNG. Khi một
 * model bị quá tải (503) hoặc hết hạn mức (429), route tự động thử model
 * tiếp theo trong danh sách thay vì báo lỗi ngay.
 */
export const TEXT_MODEL_FALLBACK_CHAIN = [
  "gemini-3.5-flash-lite", // RPD 500 — ưu tiên cao nhất
  "gemini-3.1-flash-lite", // RPD 500
  "gemini-2.5-flash-lite", // RPD 20
  "gemini-3-flash", // RPD 20
  "gemini-3.6-flash", // RPD 20
  "gemini-3.8-flash", // RPD 20, RPM thấp (5)
];

export interface GeminiCallSuccess {
  ok: true;
  data: {
    candidates?: {
      content?: { parts?: { text?: string }[] };
    }[];
    promptFeedback?: { blockReason?: string };
  };
  model: string;
}

export interface GeminiCallFailure {
  ok: false;
  status: number;
  errorText: string;
}

/**
 * Gọi lần lượt từng model trong `models` cho tới khi có model trả về 2xx.
 * Chỉ coi 429 (hết hạn mức) và 503 (quá tải) là lỗi "thử model khác" —
 * các lỗi khác (400/401/403 — sai key/định dạng request) dừng ngay vì thử
 * model khác cũng sẽ lỗi y hệt.
 */
export async function callGeminiWithFallback(
  apiKey: string,
  requestBody: Record<string, unknown>,
  models: string[] = TEXT_MODEL_FALLBACK_CHAIN
): Promise<GeminiCallSuccess | GeminiCallFailure> {
  let last: GeminiCallFailure = { ok: false, status: 500, errorText: "Không có model nào khả dụng." };

  for (const model of models) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (res.ok) {
      return { ok: true, data: await res.json(), model };
    }

    const errorText = await res.text();
    last = { ok: false, status: res.status, errorText };

    if (res.status !== 429 && res.status !== 503) {
      break;
    }
  }

  return last;
}

export function extractGeminiText(data: GeminiCallSuccess["data"]): string | undefined {
  return data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("");
}
