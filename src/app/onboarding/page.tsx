"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Home, Hammer, Paintbrush, Sofa, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { useAppStore } from "@/lib/store";
import { ProjectType } from "@/lib/types";
import { cn } from "@/lib/utils";

type Screen = "welcome" | 1 | 2 | 3;

const PROJECT_TYPES: { value: ProjectType; label: string; icon: typeof Home }[] = [
  { value: "new", label: "Xây nhà mới", icon: Hammer },
  { value: "renovate", label: "Sửa chữa / cải tạo", icon: Paintbrush },
  { value: "interior", label: "Hoàn thiện nội thất", icon: Sofa },
];

const NAME_EXAMPLES = ["Tổ ấm của mình", "Nhà gia đình", "Ngôi nhà đầu tiên"];

export default function OnboardingPage() {
  const router = useRouter();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const loadDemo = useAppStore((s) => s.loadDemo);

  const [screen, setScreen] = useState<Screen>("welcome");
  const [type, setType] = useState<ProjectType | null>(null);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState(0);
  const [startDate, setStartDate] = useState("");

  const goFinish = () => {
    completeOnboarding({
      type: type ?? "new",
      name: name.trim() || "Nhà của tôi",
      budget,
      startDate: startDate || undefined,
    });
    router.replace("/home");
  };

  const handleDemo = () => {
    loadDemo();
    router.replace("/home");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnimatePresence mode="wait">
        {screen === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col px-6 pt-20 pb-10 max-w-md mx-auto w-full"
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="h-20 w-20 rounded-3xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
                <Home className="text-white" size={36} />
              </div>
              <h1 className="text-[28px] font-semibold leading-snug mb-3">
                Ngôi nhà mơ ước,<br />trong tầm tay.
              </h1>
              <p className="text-text-secondary text-[15px] leading-relaxed max-w-xs">
                Theo dõi tiến độ, quản lý chi phí và lưu giữ mọi thông tin xây nhà — đơn giản
                hơn bao giờ hết.
              </p>
            </div>
            <div className="space-y-3">
              <Button size="lg" className="w-full" onClick={() => setScreen(1)}>
                Bắt đầu ngay
              </Button>
              <Button size="lg" variant="outline" className="w-full" onClick={handleDemo}>
                Khám phá bản demo
              </Button>
            </div>
          </motion.div>
        )}

        {screen !== "welcome" && (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col px-6 pt-14 pb-8 max-w-md mx-auto w-full"
          >
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setScreen(screen === 1 ? "welcome" : ((screen - 1) as Screen))}
                aria-label="Quay lại"
                className="h-10 w-10 -ml-2 rounded-full flex items-center justify-center hover:bg-surface-2"
              >
                <ChevronLeft size={22} />
              </button>
              <span className="text-sm font-medium text-text-secondary">Bước {screen}/3</span>
            </div>

            <div className="flex gap-1.5 mb-8">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={cn(
                    "h-1.5 flex-1 rounded-full",
                    n <= screen ? "bg-primary" : "bg-surface-2"
                  )}
                />
              ))}
            </div>

            {screen === 1 && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-[22px] font-semibold mb-6">Bạn đang chuẩn bị làm gì?</h2>
                <div className="space-y-3">
                  {PROJECT_TYPES.map((t) => {
                    const Icon = t.icon;
                    const active = type === t.value;
                    return (
                      <button
                        key={t.value}
                        onClick={() => setType(t.value)}
                        className={cn(
                          "w-full flex items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-colors",
                          active
                            ? "border-primary bg-primary-light"
                            : "border-border bg-surface"
                        )}
                      >
                        <div
                          className={cn(
                            "h-11 w-11 rounded-xl flex items-center justify-center",
                            active ? "bg-primary text-white" : "bg-surface-2 text-text-secondary"
                          )}
                        >
                          <Icon size={20} />
                        </div>
                        <span className="font-medium text-[15px]">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex-1" />
                <Button size="lg" className="w-full" disabled={!type} onClick={() => setScreen(2)}>
                  Tiếp tục
                </Button>
              </div>
            )}

            {screen === 2 && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-[22px] font-semibold mb-2">Đặt tên cho ngôi nhà của bạn</h2>
                <p className="text-text-secondary text-sm mb-6">
                  Tên này sẽ xuất hiện trên trang chủ của bạn.
                </p>
                <Input
                  autoFocus
                  placeholder="Ví dụ: Tổ ấm của mình"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-4"
                />
                <div className="flex flex-wrap gap-2 mb-6">
                  {NAME_EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setName(ex)}
                      className="text-xs font-medium px-3 py-1.5 rounded-full bg-surface-2 text-text-secondary hover:bg-border"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
                <div className="flex-1" />
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!name.trim()}
                  onClick={() => setScreen(3)}
                >
                  Tiếp tục
                </Button>
              </div>
            )}

            {screen === 3 && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-[22px] font-semibold mb-2">Ngân sách dự kiến là bao nhiêu?</h2>
                <p className="text-text-secondary text-sm mb-6">
                  Giúp bạn theo dõi chi phí dễ dàng hơn. Có thể bỏ qua nếu chưa chắc.
                </p>
                <CurrencyInput value={budget} onChange={setBudget} autoFocus />

                <div className="mt-5">
                  <label className="block text-sm font-medium mb-1.5">
                    Ngày bắt đầu dự kiến{" "}
                    <span className="text-text-secondary font-normal">(không bắt buộc)</span>
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="flex-1" />
                <Button size="lg" className="w-full" onClick={goFinish}>
                  Hoàn tất
                </Button>
                {budget === 0 && (
                  <button
                    onClick={goFinish}
                    className="text-sm text-text-secondary mt-3 text-center underline"
                  >
                    Bỏ qua, nhập sau
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
