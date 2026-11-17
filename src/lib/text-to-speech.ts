"use client";

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;

function getVoicesAsync(): Promise<SpeechSynthesisVoice[]> {
  if (!isSpeechSynthesisSupported()) return Promise.resolve([]);
  const existing = window.speechSynthesis.getVoices();
  if (existing.length > 0) return Promise.resolve(existing);

  if (!voicesPromise) {
    voicesPromise = new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
      window.speechSynthesis.onvoiceschanged = () => {
        clearTimeout(timeout);
        resolve(window.speechSynthesis.getVoices());
      };
    });
  }
  return voicesPromise;
}

/** Đọc to văn bản tiếng Việt, ưu tiên giọng tiếng Việt nếu trình duyệt có. */
export async function speak(text: string): Promise<void> {
  if (!isSpeechSynthesisSupported()) return;
  window.speechSynthesis.cancel();

  const voices = await getVoicesAsync();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "vi-VN";
  const viVoice =
    voices.find((v) => v.lang === "vi-VN") ?? voices.find((v) => v.lang.toLowerCase().startsWith("vi"));
  if (viVoice) utterance.voice = viVoice;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}
