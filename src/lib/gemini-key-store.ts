import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GeminiKeyState {
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
}

export const useGeminiKeyStore = create<GeminiKeyState>()(
  persist(
    (set) => ({
      apiKey: "",
      setApiKey: (apiKey) => set({ apiKey: apiKey.trim() }),
      clearApiKey: () => set({ apiKey: "" }),
    }),
    {
      name: "nha-minh-gemini-key",
    }
  )
);
