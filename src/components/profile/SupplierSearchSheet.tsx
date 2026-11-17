"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { StarRating } from "@/components/contacts/StarRating";
import { useGeminiKeyStore } from "@/lib/gemini-key-store";
import { useAppStore } from "@/lib/store";
import { notify } from "@/lib/toast";
import { Search, MapPin, ExternalLink, Plus, KeyRound } from "lucide-react";
import Link from "next/link";

interface SupplierResult {
  name: string;
  address?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  priceRange?: string | null;
  sourceUrl?: string | null;
}

export function SupplierSearchSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const geminiApiKey = useGeminiKeyStore((s) => s.apiKey);
  const addMaterial = useAppStore((s) => s.addMaterial);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SupplierResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setSearched(true);
    setNeedsKey(false);
    try {
      const res = await fetch("/api/find-suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, apiKey: geminiApiKey }),
      });
      const data = await res.json();
      if (data.ok) {
        setResults(data.results);
        if (data.results.length === 0) {
          notify.info("Không tìm thấy nhà cung cấp phù hợp, thử từ khóa khác nhé.");
        }
      } else {
        setResults([]);
        setNeedsKey(data.code === "missing_key" || data.code === "invalid_key");
        notify.error(data.message ?? "Có lỗi xảy ra.");
      }
    } catch {
      setResults([]);
      notify.error("Không thể kết nối để tìm kiếm lúc này.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaterial = (r: SupplierResult) => {
    addMaterial({
      name: query,
      code: r.name,
      supplier: r.name,
      status: "considering",
    });
    notify.success(`Đã thêm "${r.name}" vào Vật liệu đang cân nhắc`);
  };

  return (
    <Sheet open={open} onClose={onClose} title="Tìm nhà cung cấp vật tư">
      <div className="pt-1 space-y-4">
        <p className="text-sm text-text-secondary leading-relaxed">
          Dùng Google Search để tìm nhà cung cấp thực tế. Chỉ hiển thị sao/giá khi thực sự tìm
          thấy trên trang web — không suy đoán.
        </p>

        <div className="flex gap-2">
          <Input
            autoFocus
            placeholder="Vd: gạch Viglacera HM803, xi măng Hà Tiên..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button size="icon" disabled={!query.trim() || loading} onClick={handleSearch}>
            <Search size={18} />
          </Button>
        </div>

        {needsKey && (
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-2xl bg-warning/10 text-warning font-medium text-sm py-2.5"
          >
            <KeyRound size={15} /> Mở Cài đặt để thêm/sửa Gemini API key
          </Link>
        )}

        {loading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-surface-2 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && searched && results.length > 0 && (
          <div className="space-y-3">
            {results.map((r, i) => (
              <div key={i} className="rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="font-medium text-[15px]">{r.name}</p>
                  {r.sourceUrl && (
                    <a
                      href={r.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Xem nguồn"
                      className="text-text-secondary shrink-0"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>

                {r.address && (
                  <p className="flex items-start gap-1.5 text-xs text-text-secondary mb-2">
                    <MapPin size={13} className="mt-0.5 shrink-0" /> {r.address}
                  </p>
                )}

                <div className="flex items-center gap-3 mb-3">
                  {r.rating != null ? (
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={r.rating} size={13} />
                      <span className="text-xs text-text-secondary">
                        {r.rating.toFixed(1)}
                        {r.reviewCount != null && ` (${r.reviewCount})`}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-text-secondary">Chưa có đánh giá</span>
                  )}
                  {r.priceRange && (
                    <span className="text-xs font-medium text-primary-dark">{r.priceRange}</span>
                  )}
                </div>

                <Button variant="outline" size="sm" className="w-full" onClick={() => handleAddMaterial(r)}>
                  <Plus size={14} /> Thêm vào vật liệu đang cân nhắc
                </Button>
              </div>
            ))}
          </div>
        )}

        {!loading && searched && results.length === 0 && !needsKey && (
          <p className="text-sm text-text-secondary text-center py-6">
            Không tìm thấy kết quả. Thử từ khóa cụ thể hơn, ví dụ kèm thương hiệu hoặc khu vực.
          </p>
        )}

        <p className="text-xs text-text-secondary leading-relaxed">
          Giá chỉ mang tính tham khảo tại thời điểm tìm kiếm, có thể đã thay đổi — nên liên hệ
          trực tiếp nhà cung cấp để chốt giá chính xác.
        </p>
      </div>
    </Sheet>
  );
}
