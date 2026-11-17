"use client";

import { Sheet } from "@/components/ui/Sheet";
import { Badge } from "@/components/ui/Badge";
import { FullLunarInfo } from "@/lib/lunar-calendar";
import { LunarFengShuiNote } from "./LunarFengShuiNote";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export function LunarDateDetailSheet({
  open,
  onClose,
  info,
  date,
}: {
  open: boolean;
  onClose: () => void;
  info: FullLunarInfo;
  date: Date;
}) {
  const solarLabel = date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Sheet open={open} onClose={onClose} title="Lịch hôm nay">
      <div className="pt-1 space-y-5">
        <div className="rounded-2xl bg-surface-2 p-4 text-center">
          <p className="text-sm text-text-secondary capitalize">{solarLabel}</p>
          <p className="text-2xl font-bold mt-1">
            {info.lunar.day}/{info.lunar.month}
            {info.lunar.isLeapMonth ? " (nhuận)" : ""}
          </p>
          <p className="text-sm text-text-secondary mt-0.5">âm lịch · {info.yearCanChi}</p>
        </div>

        <div className="space-y-2.5">
          <Row label="Ngày (can chi)" value={info.dayCanChi} />
          <Row label="Tháng (can chi)" value={info.monthCanChi} />
          <Row label="Năm (can chi)" value={info.yearCanChi} />
          <Row label="Trực" value={info.fengShui.truc} />
        </div>

        <div
          className={
            "flex items-start gap-2.5 rounded-2xl px-4 py-3 " +
            (info.fengShui.isHoangDao ? "bg-success/10" : "bg-warning/10")
          }
        >
          {info.fengShui.isHoangDao ? (
            <CheckCircle2 size={18} className="text-success mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle size={18} className="text-warning mt-0.5 shrink-0" />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium text-[15px]">
                {info.fengShui.isHoangDao ? "Ngày Hoàng Đạo" : "Ngày Hắc Đạo"}
              </p>
              <Badge tone={info.fengShui.isHoangDao ? "success" : "warning"}>
                Trực {info.fengShui.truc}
              </Badge>
            </div>
            <p className="text-sm text-text-primary leading-relaxed">
              {info.fengShui.isHoangDao
                ? "Theo quan niệm dân gian, đây là ngày thuận, thích hợp cho các việc quan trọng như động thổ, khởi công."
                : "Theo quan niệm dân gian, đây là ngày cần cân nhắc hơn cho các việc quan trọng như động thổ, khởi công."}
            </p>
          </div>
        </div>

        <LunarFengShuiNote />
      </div>
    </Sheet>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
