"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}
interface SpeechRecognitionResultLike {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}
interface SpeechRecognitionResultListLike {
  readonly length: number;
  [index: number]: SpeechRecognitionResultLike;
}
interface SpeechRecognitionEventLike extends Event {
  results: SpeechRecognitionResultListLike;
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: Event) => void) | null;
  start: () => void;
  stop: () => void;
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | undefined {
  if (typeof window === "undefined") return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

export function isSpeechRecognitionSupported(): boolean {
  return !!getSpeechRecognitionCtor();
}

/**
 * Nhận diện giọng nói tiếng Việt (Web Speech API) — chỉ chạy được trên các
 * trình duyệt hỗ trợ (Chrome/Edge trên desktop & Android); Safari/iOS và
 * Firefox hiện chưa hỗ trợ, khi đó `supported` sẽ là false.
 *
 * `onTranscript` được gọi liên tục khi đang nghe (isFinal=false, để người
 * dùng thấy chữ hiện dần theo lời nói) và một lần cuối với isFinal=true —
 * cố tình KHÔNG tự gửi câu hỏi, vì nhận diện giọng nói tiếng Việt đôi khi
 * nghe sai (vd "chậm" thành "trồng"); để người dùng xem lại/sửa trước khi
 * bấm gửi.
 */
export function useSpeechRecognition(onTranscript: (text: string, isFinal: boolean) => void) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- feature detection needs `window`, unavailable during SSR render
    setSupported(isSpeechRecognitionSupported());
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = "vi-VN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? "";
        if (result.isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }
      if (finalText) {
        onTranscriptRef.current(finalText, true);
      } else if (interimText) {
        onTranscriptRef.current(interimText, false);
      }
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }, []);

  useEffect(() => stop, [stop]);

  return { supported, listening, start, stop };
}
