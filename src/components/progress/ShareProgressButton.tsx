"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { buildShareSnapshot, encodeShareSnapshot } from "@/lib/share-snapshot";
import { notify } from "@/lib/toast";

export function ShareProgressButton() {
  const homeProfile = useAppStore((s) => s.homeProfile);
  const stages = useAppStore((s) => s.stages);
  const expenses = useAppStore((s) => s.expenses);
  const journal = useAppStore((s) => s.journal);
  const documents = useAppStore((s) => s.documents);
  const materials = useAppStore((s) => s.materials);
  const tasks = useAppStore((s) => s.tasks);
  const contacts = useAppStore((s) => s.contacts);
  const onboardingDone = useAppStore((s) => s.onboardingDone);

  const [busy, setBusy] = useState(false);

  const handleShare = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const snapshot = buildShareSnapshot({
        onboardingDone,
        homeProfile,
        stages,
        expenses,
        journal,
        documents,
        materials,
        tasks,
        contacts,
      });
      const encoded = encodeShareSnapshot(snapshot);
      const url = `${window.location.origin}/share/${encoded}`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: `Tiến độ ${snapshot.homeName}`,
            text: `Xem tiến độ xây nhà của ${snapshot.homeName} — không cần đăng nhập.`,
            url,
          });
          notify.success("Đã chia sẻ link!");
          return;
        } catch {
          // người dùng hủy chia sẻ — thử phương án sao chép bên dưới
        }
      }

      await navigator.clipboard.writeText(url);
      notify.success("Đã sao chép link chia sẻ vào bộ nhớ tạm");
    } catch {
      notify.error("Không tạo được link chia sẻ, bạn thử lại nhé.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={busy}
      aria-label="Chia sẻ tiến độ"
      className="h-10 w-10 rounded-full bg-surface-2 flex items-center justify-center text-text-secondary disabled:opacity-50"
    >
      <Share2 size={18} />
    </button>
  );
}
