"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/format";
import { notify } from "@/lib/toast";
import { RotateCcw, Home, Info, BookOpenText, ChevronRight } from "lucide-react";
import { GlossaryListSheet } from "@/components/glossary/GlossaryListSheet";

const TYPE_LABEL: Record<string, string> = {
  new: "Xây nhà mới",
  renovate: "Sửa chữa / cải tạo",
  interior: "Hoàn thiện nội thất",
};

export default function SettingsPage() {
  const router = useRouter();
  const homeProfile = useAppStore((s) => s.homeProfile);
  const resetDemo = useAppStore((s) => s.resetDemo);
  const loadDemo = useAppStore((s) => s.loadDemo);
  const [confirmReset, setConfirmReset] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  return (
    <div className="pb-6">
      <PageHeader title="Cài đặt" onBack />

      <div className="px-5 space-y-5">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-2xl bg-primary-light text-primary-dark flex items-center justify-center">
              <Home size={20} />
            </div>
            <div>
              <p className="font-semibold text-[15px]">{homeProfile?.name}</p>
              <p className="text-xs text-text-secondary">
                {homeProfile ? TYPE_LABEL[homeProfile.type] : ""}
              </p>
            </div>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Ngân sách dự kiến</span>
              <span className="font-medium tabular-nums">
                {formatCurrency(homeProfile?.budget ?? 0)}
              </span>
            </div>
            {homeProfile?.startDate && (
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Ngày bắt đầu</span>
                <span className="font-medium">{formatDate(homeProfile.startDate)}</span>
              </div>
            )}
          </div>
        </Card>

        <button
          onClick={() => setGlossaryOpen(true)}
          className="w-full flex items-center gap-3 bg-surface border border-border rounded-2xl p-4 text-left"
        >
          <div className="h-11 w-11 rounded-2xl bg-primary-light text-primary-dark flex items-center justify-center shrink-0">
            <BookOpenText size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[15px]">Từ điển xây nhà</p>
            <p className="text-xs text-text-secondary">Giải nghĩa thuật ngữ xây dựng dễ hiểu</p>
          </div>
          <ChevronRight size={18} className="text-text-secondary shrink-0" />
        </button>

        <Card className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <Info size={18} className="text-text-secondary mt-0.5 shrink-0" />
            <p className="text-sm text-text-secondary leading-relaxed">
              Đây là bản demo. Toàn bộ dữ liệu được lưu trên thiết bị của bạn, không đồng bộ
              lên máy chủ.
            </p>
          </div>
        </Card>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            loadDemo();
            notify.success("Đã tải lại dữ liệu mẫu");
          }}
        >
          Tải dữ liệu mẫu
        </Button>

        <Button variant="danger" className="w-full" onClick={() => setConfirmReset(true)}>
          <RotateCcw size={16} /> Đặt lại dữ liệu demo
        </Button>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Đặt lại toàn bộ dữ liệu?"
        description="Mọi thông tin về ngôi nhà, chi phí, nhật ký, tài liệu và vật liệu sẽ bị xóa."
        confirmLabel="Đặt lại"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetDemo();
          setConfirmReset(false);
          router.replace("/onboarding");
        }}
      />

      <GlossaryListSheet open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </div>
  );
}
