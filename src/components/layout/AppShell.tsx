"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { BottomNavigation } from "./BottomNavigation";
import { GlossaryTermSheet } from "@/components/glossary/GlossaryTermSheet";

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const onboardingDone = useAppStore((s) => s.onboardingDone);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard client-hydration flag, no SSR-safe alternative
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !onboardingDone) {
      router.replace("/onboarding");
    }
  }, [hydrated, onboardingDone, router]);

  if (!hydrated || !onboardingDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 mx-auto w-full max-w-md pb-28">{children}</div>
      <BottomNavigation />
      <GlossaryTermSheet />
    </div>
  );
}
