"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { useGeminiKeyStore } from "@/lib/gemini-key-store";
import { buildAssistantContext } from "@/lib/assistant-context";
import { useSpeechRecognition } from "@/lib/speech-recognition";
import { isSpeechSynthesisSupported, speak, stopSpeaking } from "@/lib/text-to-speech";
import { Bot, Send, User, KeyRound, Mic, Square, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  text: string;
  isError?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "Nhà tôi đang chậm tiến độ không?",
  "Tháng này tôi chi nhiều hơn tháng trước không?",
  "Có vấn đề gì cần xử lý không?",
  "Tôi sắp cần thanh toán đợt nào chưa?",
];

const GREETING: Message = {
  role: "assistant",
  text: "Xin chào! Tôi là trợ lý của Nhà Mình. Hỏi tôi bất cứ điều gì về tiến độ, chi phí hay công việc đang chờ của ngôi nhà bạn nhé.",
};

export function AssistantSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const homeProfile = useAppStore((s) => s.homeProfile);
  const stages = useAppStore((s) => s.stages);
  const expenses = useAppStore((s) => s.expenses);
  const journal = useAppStore((s) => s.journal);
  const tasks = useAppStore((s) => s.tasks);
  const documents = useAppStore((s) => s.documents);
  const materials = useAppStore((s) => s.materials);
  const contacts = useAppStore((s) => s.contacts);
  const rooms = useAppStore((s) => s.rooms);
  const evidenceRecords = useAppStore((s) => s.evidenceRecords);
  const onboardingDone = useAppStore((s) => s.onboardingDone);

  const geminiApiKey = useGeminiKeyStore((s) => s.apiKey);

  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) stopSpeaking();
  }, [open]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  const ask = async (question: string) => {
    if (!question.trim() || loading) return;
    stopSpeaking();
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    scrollToBottom();

    try {
      const context = buildAssistantContext({
        onboardingDone,
        homeProfile,
        stages,
        expenses,
        journal,
        documents,
        materials,
        tasks,
        contacts,
        rooms,
        evidenceRecords,
      });

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context, apiKey: geminiApiKey }),
      });
      const data = await res.json();

      if (data.ok) {
        setNeedsKey(false);
        setMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
        if (autoSpeak) speak(data.answer);
      } else {
        setNeedsKey(data.code === "missing_key" || data.code === "invalid_key");
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.message ?? "Có lỗi xảy ra.", isError: true },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Không thể kết nối tới trợ lý lúc này. Kiểm tra mạng và thử lại.",
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const { supported: micSupported, listening, start: startListening, stop: stopListening } =
    useSpeechRecognition((text) => setInput(text));

  return (
    <Sheet open={open} onClose={onClose} title="Trợ lý nhà bạn" className="sm:max-w-lg">
      <div className="flex flex-col h-[70vh]">
        {isSpeechSynthesisSupported() && (
          <div className="flex justify-end mb-2">
            <button
              onClick={() => {
                if (autoSpeak) stopSpeaking();
                setAutoSpeak((v) => !v);
              }}
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full",
                autoSpeak ? "bg-primary-light text-primary-dark" : "bg-surface-2 text-text-secondary"
              )}
            >
              {autoSpeak ? <Volume2 size={13} /> : <VolumeX size={13} />}
              Đọc to câu trả lời
            </button>
          </div>
        )}

        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1 -mr-1">
          {messages.map((m, i) => (
            <MessageBubble key={i} message={m} canSpeak={isSpeechSynthesisSupported()} />
          ))}

          {loading && (
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary-light text-primary-dark flex items-center justify-center shrink-0">
                <Bot size={14} />
              </div>
              <div className="rounded-2xl bg-surface-2 px-4 py-2.5 flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-text-secondary animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-text-secondary animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-text-secondary animate-bounce" />
              </div>
            </div>
          )}

          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="text-sm px-3 py-1.5 rounded-full bg-primary-light text-primary-dark font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {needsKey && (
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-2xl bg-warning/10 text-warning font-medium text-sm py-2.5 mt-3"
          >
            <KeyRound size={15} /> Mở Cài đặt để thêm/sửa Gemini API key
          </Link>
        )}

        <div className="flex items-center gap-2 pt-3 border-t border-border mt-3">
          {micSupported && (
            <Button
              type="button"
              variant={listening ? "danger" : "outline"}
              size="icon"
              onClick={() => (listening ? stopListening() : startListening())}
              aria-label={listening ? "Dừng nghe" : "Nói để hỏi"}
              className={listening ? "animate-pulse" : undefined}
            >
              {listening ? <Square size={16} /> : <Mic size={18} />}
            </Button>
          )}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") ask(input);
            }}
            placeholder={listening ? "Đang nghe..." : "Hỏi về nhà của bạn..."}
            className="flex-1 h-11 rounded-2xl bg-surface-2 border border-border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <Button
            size="icon"
            disabled={!input.trim() || loading}
            onClick={() => ask(input)}
            aria-label="Gửi câu hỏi"
          >
            <Send size={18} />
          </Button>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed pt-2">
          Trợ lý trả lời dựa trên dữ liệu dự án của bạn, có thể chưa chính xác hoàn toàn — không
          thay thế cho trao đổi trực tiếp với thầu hoặc chuyên gia.
        </p>
      </div>
    </Sheet>
  );
}

function MessageBubble({ message, canSpeak }: { message: Message; canSpeak: boolean }) {
  const isUser = message.role === "user";
  const showSpeak = canSpeak && !isUser && !message.isError;
  return (
    <div className={cn("flex items-start gap-2", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
          isUser ? "bg-surface-2 text-text-secondary" : "bg-primary-light text-primary-dark"
        )}
      >
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>
      <div
        className={cn(
          "group max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed flex items-start gap-2",
          isUser
            ? "bg-primary text-white"
            : message.isError
              ? "bg-danger/10 text-danger"
              : "bg-surface-2 text-text-primary"
        )}
      >
        <span>{message.text}</span>
        {showSpeak && (
          <button
            onClick={() => speak(message.text)}
            aria-label="Nghe câu trả lời"
            className="shrink-0 text-text-secondary hover:text-primary mt-0.5"
          >
            <Volume2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
