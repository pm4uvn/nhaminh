"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

export default function RootPage() {
  const router = useRouter();
  const onboardingDone = useAppStore((s) => s.onboardingDone);

  useEffect(() => {
    router.replace(onboardingDone ? "/home" : "/onboarding");
  }, [onboardingDone, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}
