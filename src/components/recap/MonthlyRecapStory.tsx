"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { MonthlyRecap } from "@/lib/monthly-recap";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Slide {
  background: string;
  content: React.ReactNode;
}

function buildSlides(recap: MonthlyRecap): Slide[] {
  const slides: Slide[] = [];

  slides.push({
    background: "linear-gradient(160deg, #286F65, #20574F)",
    content: (
      <div className="flex flex-col items-center text-center gap-3">
        <span className="text-5xl">🏠</span>
        <h2 className="text-2xl font-bold text-white leading-snug">{recap.monthLabel}</h2>
        <p className="text-white/80 text-[15px]">
          Hãy cùng nhìn lại chặng đường xây nhà của bạn trong tháng này.
        </p>
      </div>
    ),
  });

  slides.push({
    background: "linear-gradient(160deg, #D98C68, #B86A48)",
    content: (
      <div className="flex flex-col items-center text-center gap-3">
        <p className="text-white/80 text-sm font-medium">Tiến độ hiện tại</p>
        <p className="text-7xl font-bold text-white tabular-nums">{recap.overallProgress}%</p>
        {recap.currentStageName && (
          <p className="text-white text-[17px] font-medium">
            Đang ở giai đoạn &quot;{recap.currentStageName}&quot;
          </p>
        )}
        <p className="text-white/70 text-sm mt-2">
          Tổng cộng đã thanh toán {formatCurrencyCompact(recap.totalPaidAllTime)} từ khi bắt đầu.
        </p>
      </div>
    ),
  });

  if (recap.expenseCount > 0) {
    const vsLabel =
      recap.spentVsLastMonth > 0
        ? `nhiều hơn ${formatCurrencyCompact(recap.spentVsLastMonth)} so với tháng trước`
        : recap.spentVsLastMonth < 0
          ? `ít hơn ${formatCurrencyCompact(Math.abs(recap.spentVsLastMonth))} so với tháng trước`
          : "bằng với tháng trước";

    slides.push({
      background: "linear-gradient(160deg, #2F8B69, #1F6B50)",
      content: (
        <div className="flex flex-col items-center text-center gap-3">
          <p className="text-white/80 text-sm font-medium">Chi phí tháng này</p>
          <p className="text-4xl font-bold text-white tabular-nums">
            {formatCurrency(recap.totalSpent)}
          </p>
          <p className="text-white/80 text-[15px]">
            qua {recap.expenseCount} khoản chi — {vsLabel}
          </p>
          {recap.biggestExpense && (
            <div className="mt-3 rounded-2xl bg-white/10 px-4 py-3">
              <p className="text-xs text-white/70 mb-1">Khoản chi lớn nhất</p>
              <p className="text-white font-medium">{recap.biggestExpense.description}</p>
              <p className="text-white text-lg font-bold tabular-nums">
                {formatCurrency(recap.biggestExpense.amount)}
              </p>
            </div>
          )}
        </div>
      ),
    });
  }

  if (recap.journalCount > 0 || recap.newIssuesCount > 0 || recap.resolvedIssuesCount > 0) {
    slides.push({
      background: "linear-gradient(160deg, #D99A32, #B97A1E)",
      content: (
        <div className="flex flex-col items-center text-center gap-4">
          <p className="text-white/80 text-sm font-medium">Nhật ký & sự cố</p>
          <p className="text-5xl font-bold text-white tabular-nums">{recap.journalCount}</p>
          <p className="text-white/80 text-[15px]">lần cập nhật nhật ký trong tháng</p>
          <div className="flex gap-3 mt-2">
            {recap.resolvedIssuesCount > 0 && (
              <div className="rounded-2xl bg-white/10 px-4 py-2.5">
                <p className="text-2xl font-bold text-white">{recap.resolvedIssuesCount}</p>
                <p className="text-xs text-white/70">sự cố đã giải quyết</p>
              </div>
            )}
            {recap.newIssuesCount > 0 && (
              <div className="rounded-2xl bg-white/10 px-4 py-2.5">
                <p className="text-2xl font-bold text-white">{recap.newIssuesCount}</p>
                <p className="text-xs text-white/70">sự cố mới phát hiện</p>
              </div>
            )}
          </div>
        </div>
      ),
    });
  }

  slides.push({
    background: "linear-gradient(160deg, #20574F, #153D37)",
    content: (
      <div className="flex flex-col items-center text-center gap-3">
        <span className="text-5xl">✨</span>
        <p className="text-white text-xl font-semibold leading-snug">
          Ngôi nhà của bạn đang dần thành hình.
        </p>
        <p className="text-white/80 text-[15px]">Hẹn gặp lại vào bản tổng kết tháng sau!</p>
      </div>
    ),
  });

  return slides;
}

export function MonthlyRecapStory({
  open,
  onClose,
  recap,
}: {
  open: boolean;
  onClose: () => void;
  recap: MonthlyRecap;
}) {
  const [index, setIndex] = useState(0);
  const slides = useMemo(() => buildSlides(recap), [recap]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resets to the first slide each time the story opens
    if (open) setIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(slides.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, slides.length]);

  if (typeof document === "undefined") return null;

  const goNext = () => {
    if (index >= slides.length - 1) {
      onClose();
    } else {
      setIndex((i) => i + 1);
    }
  };
  const goPrev = () => setIndex((i) => Math.max(0, i - 1));

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-center justify-center"
        >
          <div
            className="relative w-full h-full sm:h-[85vh] sm:max-w-sm sm:rounded-3xl overflow-hidden flex flex-col"
            style={{ background: slides[index].background }}
          >
            <div className="absolute inset-0 flex z-0">
              <button aria-label="Trước" onClick={goPrev} className="w-1/3 h-full" tabIndex={-1} />
              <div className="w-1/3 h-full" />
              <button aria-label="Tiếp" onClick={goNext} className="w-1/3 h-full" tabIndex={-1} />
            </div>

            <div className="relative z-10 flex gap-1.5 px-4 pt-[calc(env(safe-area-inset-top)+12px)]">
              {slides.map((_, i) => (
                <div key={i} className="h-1 flex-1 rounded-full bg-white/25 overflow-hidden">
                  <div
                    className={cn(
                      "h-full bg-white rounded-full",
                      i < index && "w-full",
                      i === index && "w-full transition-all duration-500",
                      i > index && "w-0"
                    )}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              aria-label="Đóng"
              className="absolute z-10 top-[calc(env(safe-area-inset-top)+20px)] right-4 h-9 w-9 rounded-full bg-black/20 text-white flex items-center justify-center"
            >
              <X size={18} />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="relative z-10 flex-1 flex items-center justify-center px-8 pointer-events-none"
              >
                {slides[index].content}
              </motion.div>
            </AnimatePresence>

            <div className="relative z-10 px-8 pb-[calc(env(safe-area-inset-bottom)+20px)]">
              <button
                onClick={goNext}
                className="w-full h-11 rounded-full bg-white/15 text-white text-sm font-medium backdrop-blur"
              >
                {index >= slides.length - 1 ? "Đóng" : "Tiếp theo"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
