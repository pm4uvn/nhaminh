"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FieldLabel, Input } from "@/components/ui/Field";
import { useGeminiKeyStore } from "@/lib/gemini-key-store";
import { notify } from "@/lib/toast";

export function GeminiKeyCard() {
  const apiKey = useGeminiKeyStore((s) => s.apiKey);
  const setApiKey = useGeminiKeyStore((s) => s.setApiKey);
  const clearApiKey = useGeminiKeyStore((s) => s.clearApiKey);

  const [draft, setDraft] = useState(apiKey);
  const [visible, setVisible] = useState(false);

  const hasKey = apiKey.length > 0;
  const isDirty = draft.trim() !== apiKey;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-11 w-11 rounded-2xl bg-primary-light text-primary-dark flex items-center justify-center shrink-0">
          <KeyRound size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[15px]">Gemini API key</p>
          <p className="text-xs text-text-secondary">
            {hasKey ? "Đã thiết lập — dùng cho Trợ lý nhà bạn" : "Chưa có key — Trợ lý sẽ không hoạt động"}
          </p>
        </div>
      </div>

      <FieldLabel optional>Dán API key (lấy miễn phí tại aistudio.google.com/apikey)</FieldLabel>
      <div className="relative mb-3">
        <Input
          type={visible ? "text" : "password"}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="AIzaSy..."
          className="pr-11"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ẩn key" : "Hiện key"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>

      <div className="flex gap-2">
        <Button
          className="flex-1"
          disabled={!isDirty || !draft.trim()}
          onClick={() => {
            setApiKey(draft);
            notify.success("Đã lưu Gemini API key");
          }}
        >
          Lưu key
        </Button>
        {hasKey && (
          <Button
            variant="outline"
            onClick={() => {
              clearApiKey();
              setDraft("");
              notify.success("Đã xóa key");
            }}
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>

      <p className="text-xs text-text-secondary leading-relaxed mt-3">
        Key chỉ được lưu trên thiết bị này (localStorage), chỉ dùng để gọi Gemini khi bạn hỏi Trợ
        lý — không đồng bộ lên máy chủ nào khác.
      </p>
    </Card>
  );
}
