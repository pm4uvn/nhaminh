"use client";

import { useMemo, useState } from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/lib/store";
import { buildMonthlyRecap } from "@/lib/monthly-recap";
import { MonthlyRecapStory } from "./MonthlyRecapStory";

export function MonthlyRecapEntryCard() {
  const homeProfile = useAppStore((s) => s.homeProfile);
  const stages = useAppStore((s) => s.stages);
  const expenses = useAppStore((s) => s.expenses);
  const journal = useAppStore((s) => s.journal);
  const documents = useAppStore((s) => s.documents);
  const materials = useAppStore((s) => s.materials);
  const tasks = useAppStore((s) => s.tasks);
  const contacts = useAppStore((s) => s.contacts);
  const onboardingDone = useAppStore((s) => s.onboardingDone);

  const [open, setOpen] = useState(false);

  const recap = useMemo(
    () =>
      buildMonthlyRecap({
        onboardingDone,
        homeProfile,
        stages,
        expenses,
        journal,
        documents,
        materials,
        tasks,
        contacts,
      }),
    [onboardingDone, homeProfile, stages, expenses, journal, documents, materials, tasks, contacts]
  );

  return (
    <>
      <button onClick={() => setOpen(true)} className="w-full text-left">
        <Card className="p-4 flex items-center gap-3 overflow-hidden relative">
          <div className="h-11 w-11 rounded-2xl bg-terracotta/15 text-terracotta flex items-center justify-center shrink-0">
            <Sparkles size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-medium">Xem lại {recap.monthLabel.toLowerCase()}</p>
            <p className="text-xs text-text-secondary">
              Tiến độ, chi phí và nhật ký của bạn — tóm tắt trong vài giây
            </p>
          </div>
          <ChevronRight size={18} className="text-text-secondary shrink-0" />
        </Card>
      </button>

      <MonthlyRecapStory open={open} onClose={() => setOpen(false)} recap={recap} />
    </>
  );
}
