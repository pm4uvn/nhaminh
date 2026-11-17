"use client";

import { useState } from "react";
import { Bot, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AssistantSheet } from "./AssistantSheet";

export function AssistantEntryCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="w-full text-left">
        <Card className="p-4 flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-primary-light text-primary-dark flex items-center justify-center shrink-0">
            <Bot size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-medium">Hỏi trợ lý về nhà của bạn</p>
            <p className="text-xs text-text-secondary">
              Tiến độ, chi phí, việc cần làm — hỏi gì cũng được
            </p>
          </div>
          <ChevronRight size={18} className="text-text-secondary shrink-0" />
        </Card>
      </button>

      <AssistantSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
