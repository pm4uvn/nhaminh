import { create } from "zustand";

interface GlossaryUiState {
  openTermId: string | null;
  openTerm: (id: string) => void;
  close: () => void;
}

export const useGlossaryUi = create<GlossaryUiState>((set) => ({
  openTermId: null,
  openTerm: (id) => set({ openTermId: id }),
  close: () => set({ openTermId: null }),
}));
