import { NextRequest } from "next/server";

/**
 * Giới hạn số lượt gọi đơn giản theo IP, lưu trong bộ nhớ của tiến trình
 * server. Chỉ hiệu quả với 1 tiến trình duy nhất (đúng với cách chạy local/
 * một server nhỏ của prototype này) — nếu deploy nhiều instance song song
 * thì mỗi instance sẽ có bộ đếm riêng. Mục tiêu là chặn lạm dụng cơ bản khi
 * route dùng chung GEMINI_API_KEY của server, không phải một hệ thống
 * rate-limit phân tán đầy đủ.
 */
const buckets = new Map<string, { count: number; windowStart: number }>();

export function getClientKey(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart > windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    const retryAfterSeconds = Math.ceil((bucket.windowStart + windowMs - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
