"use client";

import { useAppStore } from "@/lib/store";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { BudgetSummary } from "@/components/dashboard/BudgetSummary";
import { TaskListCard } from "@/components/dashboard/TaskListCard";
import { IssueBanner } from "@/components/dashboard/IssueBanner";
import { QuickActionsRow } from "@/components/dashboard/QuickActionsRow";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { BudgetPaceBanner } from "@/components/dashboard/BudgetPaceBanner";
import { PaymentReminderBanner } from "@/components/dashboard/PaymentReminderBanner";
import { LunarDateCard } from "@/components/calendar/LunarDateCard";

export default function HomePage() {
  const homeProfile = useAppStore((s) => s.homeProfile);
  const stages = useAppStore((s) => s.stages);
  const expenses = useAppStore((s) => s.expenses);
  const tasks = useAppStore((s) => s.tasks);
  const journal = useAppStore((s) => s.journal);

  const unresolvedIssues = journal.filter(
    (j) => j.isIssue && j.issueStatus !== "resolved"
  ).length;

  return (
    <div className="pb-6">
      <DashboardHeader homeName={homeProfile?.name ?? "Nhà của tôi"} />

      <div className="px-5 space-y-4">
        <LunarDateCard />
        <ProgressCard stages={stages} startDate={homeProfile?.startDate} />
        <WeatherCard />
        <BudgetSummary budget={homeProfile?.budget ?? 0} expenses={expenses} />
        <BudgetPaceBanner stages={stages} budget={homeProfile?.budget ?? 0} expenses={expenses} />
        <PaymentReminderBanner stages={stages} budget={homeProfile?.budget ?? 0} />
        <IssueBanner count={unresolvedIssues} />
        <TaskListCard tasks={tasks} />

        <div>
          <h2 className="text-[15px] font-semibold mb-2 px-1">Thao tác nhanh</h2>
          <QuickActionsRow />
        </div>
      </div>
    </div>
  );
}
