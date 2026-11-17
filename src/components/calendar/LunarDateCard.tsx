"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getFullLunarInfo } from "@/lib/lunar-calendar";
import { LunarDateDetailSheet } from "./LunarDateDetailSheet";

export function LunarDateCard() {
  const [open, setOpen] = useState(false);
  const info = useMemo(() => getFullLunarInfo(new Date()), []);
  const today = useMemo(() => new Date(), []);

  const solarLabel = today.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const lunarLabel = `${info.lunar.day}/${info.lunar.month}${
    info.lunar.isLeapMonth ? " (nhuận)" : ""
  } âm lịch`;

  return (
    <>
      <button onClick={() => setOpen(true)} className="w-full text-left">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-terracotta/15 text-terracotta flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-medium capitalize truncate">{solarLabel}</p>
              <p className="text-xs text-text-secondary mt-0.5">
                {lunarLabel} · {info.dayCanChi}
              </p>
            </div>
            <Badge tone={info.fengShui.isHoangDao ? "success" : "warning"}>
              {info.fengShui.isHoangDao ? "Hoàng đạo" : "Hắc đạo"}
            </Badge>
            <ChevronRight size={18} className="text-text-secondary shrink-0" />
          </div>
        </Card>
      </button>

      <LunarDateDetailSheet open={open} onClose={() => setOpen(false)} info={info} date={today} />
    </>
  );
}
