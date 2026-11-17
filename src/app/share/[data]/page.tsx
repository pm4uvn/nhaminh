"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { Home, AlertTriangle, CalendarClock, Link2Off } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { decodeShareSnapshot } from "@/lib/share-snapshot";
import { formatCurrency, formatDate, formatWeeksRemaining } from "@/lib/format";

export default function SharedProgressPage({
  params,
}: {
  params: Promise<{ data: string }>;
}) {
  const { data } = use(params);
  const snapshot = useMemo(() => decodeShareSnapshot(data), [data]);

  if (!snapshot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-xs">
          <div className="h-16 w-16 rounded-full bg-surface-2 text-text-secondary flex items-center justify-center mx-auto mb-4">
            <Link2Off size={28} />
          </div>
          <h1 className="text-lg font-semibold mb-1">Link không hợp lệ</h1>
          <p className="text-sm text-text-secondary">
            Link chia sẻ này có thể đã bị hỏng hoặc sai định dạng. Hãy xin lại link mới từ người
            đã chia sẻ.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-md px-5 pt-[calc(env(safe-area-inset-top)+20px)] pb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-11 w-11 rounded-2xl bg-primary flex items-center justify-center shrink-0">
            <Home className="text-white" size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-[20px] font-semibold truncate">{snapshot.homeName}</p>
            <p className="text-xs text-text-secondary">Tiến độ chia sẻ bởi chủ nhà</p>
          </div>
        </div>

        <div className="rounded-2xl bg-surface-2 px-4 py-3 mb-5">
          <p className="text-xs text-text-secondary leading-relaxed">
            Đây là bản xem trước tại thời điểm <strong>{formatDate(snapshot.generatedAt)}</strong>{" "}
            — không tự cập nhật theo thời gian thực. Xin link mới nếu bạn muốn xem tình hình mới
            nhất.
          </p>
        </div>

        <Card className="p-5 mb-4">
          <div className="flex items-end gap-2 mb-3">
            <span className="text-4xl font-bold text-primary tabular-nums">
              {snapshot.progress}%
            </span>
            {snapshot.currentStageName && (
              <span className="text-sm font-medium text-text-secondary mb-1.5">
                Đang {snapshot.currentStageName}
              </span>
            )}
          </div>
          <ProgressBar value={snapshot.progress} />

          {snapshot.etaWeeks && snapshot.etaDate && (
            <div className="flex items-start gap-2 rounded-xl bg-primary-light px-3 py-2.5 mt-3">
              <CalendarClock size={16} className="text-primary-dark mt-0.5 shrink-0" />
              <p className="text-sm text-primary-dark leading-snug">
                Còn {formatWeeksRemaining(snapshot.etaWeeks)} nữa là xong — dự kiến khoảng{" "}
                {formatDate(snapshot.etaDate)}.
              </p>
            </div>
          )}
        </Card>

        <Card className="p-4 mb-4">
          <p className="text-sm font-semibold mb-3">Các giai đoạn</p>
          <div className="space-y-3">
            {snapshot.stages.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{s.name}</span>
                  <Badge tone="neutral">{s.status}</Badge>
                </div>
                <ProgressBar value={s.progress} className="h-1.5" />
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <Card className="p-3 text-center">
            <p className="text-[10px] text-text-secondary mb-1">Ngân sách</p>
            <p className="text-xs font-semibold tabular-nums">{formatCurrency(snapshot.budget)}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-[10px] text-text-secondary mb-1">Đã chi</p>
            <p className="text-xs font-semibold tabular-nums">{formatCurrency(snapshot.paid)}</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-[10px] text-text-secondary mb-1">Còn lại</p>
            <p className="text-xs font-semibold tabular-nums text-success">
              {formatCurrency(snapshot.remaining)}
            </p>
          </Card>
        </div>

        {snapshot.unresolvedIssuesCount > 0 && (
          <div className="flex items-center gap-3 rounded-2xl bg-warning/10 border border-warning/20 px-4 py-3.5 mb-4">
            <AlertTriangle size={18} className="text-warning shrink-0" />
            <p className="text-sm font-medium">
              Hiện có {snapshot.unresolvedIssuesCount} vấn đề đang chờ xử lý.
            </p>
          </div>
        )}

        {snapshot.recentJournal.length > 0 && (
          <Card className="p-4 mb-6">
            <p className="text-sm font-semibold mb-3">Nhật ký gần đây</p>
            <div className="divide-y divide-border">
              {snapshot.recentJournal.map((j, i) => (
                <div key={i} className="py-2.5">
                  <p className="text-xs text-text-secondary mb-0.5">{formatDate(j.date)}</p>
                  <p className="text-sm">{j.caption}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="text-center">
          <p className="text-xs text-text-secondary mb-3">
            Được chia sẻ từ ứng dụng Nhà Mình — không cần tài khoản để xem.
          </p>
          <Link href="/">
            <Button variant="outline" size="sm">
              Tìm hiểu về Nhà Mình
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
