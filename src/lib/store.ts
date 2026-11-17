import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AppState,
  ChecklistItem,
  Contact,
  ContactReview,
  DocumentRecord,
  EvidenceRecord,
  Expense,
  HomeLocation,
  HomeProfile,
  IssueStatus,
  JournalEntry,
  Material,
  ProjectType,
  Stage,
  Task,
} from "./types";
import { expenseCategoryForStageOrder } from "./payment-schedule";
import {
  mockContacts,
  mockDocuments,
  mockEvidenceRecords,
  mockExpenses,
  mockHomeProfile,
  mockJournal,
  mockMaterials,
  mockRooms,
  mockStages,
  mockTasks,
} from "./mock-data";

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface Store extends AppState {
  completeOnboarding: (input: {
    type: ProjectType;
    name: string;
    budget: number;
    startDate?: string;
  }) => void;
  loadDemo: () => void;
  resetDemo: () => void;
  setHomeLocation: (location: HomeLocation) => void;

  addExpense: (e: Omit<Expense, "id">) => void;
  updateExpense: (id: string, e: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  toggleChecklistItem: (stageId: string, itemId: string) => void;
  addChecklistItem: (stageId: string, title: string) => void;
  setStageStatus: (stageId: string, status: Stage["status"]) => void;
  setStageNote: (stageId: string, note: string) => void;
  confirmStagePayment: (stageId: string, amount: number) => void;
  toggleAskedQuestion: (stageId: string, questionId: string) => void;

  addJournalEntry: (e: Omit<JournalEntry, "id">) => void;
  setIssueStatus: (id: string, status: IssueStatus, note?: string) => void;

  addDocument: (d: Omit<DocumentRecord, "id">) => void;
  renameDocument: (id: string, name: string) => void;
  deleteDocument: (id: string) => void;

  addMaterial: (m: Omit<Material, "id">) => void;
  updateMaterial: (id: string, m: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;

  addTask: (t: Omit<Task, "id" | "done">) => void;
  toggleTask: (id: string) => void;

  addContact: (c: Omit<Contact, "id" | "reviews">) => void;
  updateContact: (id: string, c: Partial<Omit<Contact, "id" | "reviews">>) => void;
  deleteContact: (id: string) => void;
  addContactReview: (contactId: string, review: Omit<ContactReview, "id">) => void;
  deleteContactReview: (contactId: string, reviewId: string) => void;

  addRoom: (name: string) => void;
  deleteRoom: (id: string) => void;
  addEvidenceRecord: (e: Omit<EvidenceRecord, "id">) => void;
  deleteEvidenceRecord: (id: string) => void;
}

const emptyState: AppState = {
  onboardingDone: false,
  homeProfile: null,
  expenses: [],
  stages: [],
  journal: [],
  documents: [],
  materials: [],
  tasks: [],
  contacts: [],
  rooms: [],
  evidenceRecords: [],
};

export const useAppStore = create<Store>()(
  persist(
    (set, get) => ({
      ...emptyState,

      completeOnboarding: ({ type, name, budget, startDate }) => {
        const profile: HomeProfile = {
          id: uid("home"),
          name,
          type,
          budget,
          startDate,
          createdAt: new Date().toISOString().slice(0, 10),
        };
        set({
          onboardingDone: true,
          homeProfile: profile,
          expenses: [],
          stages: mockStages.map((s) => ({
            ...s,
            status: s.order === 1 ? "doing" : "todo",
            checklist: s.checklist.map((c) => ({ ...c, done: false })),
            paymentConfirmed: false,
          })),
          journal: [],
          documents: [],
          materials: [],
          tasks: [],
          contacts: [],
          rooms: [],
          evidenceRecords: [],
        });
      },

      loadDemo: () => {
        set({
          onboardingDone: true,
          homeProfile: mockHomeProfile,
          expenses: mockExpenses,
          stages: mockStages,
          journal: mockJournal,
          documents: mockDocuments,
          materials: mockMaterials,
          tasks: mockTasks,
          contacts: mockContacts,
          rooms: mockRooms,
          evidenceRecords: mockEvidenceRecords,
        });
      },

      resetDemo: () => {
        set({ ...emptyState });
      },

      setHomeLocation: (location) => {
        const profile = get().homeProfile;
        if (!profile) return;
        set({ homeProfile: { ...profile, location } });
      },

      addExpense: (e) =>
        set({ expenses: [{ ...e, id: uid("e") }, ...get().expenses] }),
      updateExpense: (id, patch) =>
        set({
          expenses: get().expenses.map((e) =>
            e.id === id ? { ...e, ...patch } : e
          ),
        }),
      deleteExpense: (id) =>
        set({ expenses: get().expenses.filter((e) => e.id !== id) }),

      toggleChecklistItem: (stageId, itemId) =>
        set({
          stages: get().stages.map((s) => {
            if (s.id !== stageId) return s;
            const checklist: ChecklistItem[] = s.checklist.map((c) =>
              c.id === itemId ? { ...c, done: !c.done } : c
            );
            return { ...s, checklist };
          }),
        }),

      addChecklistItem: (stageId, title) =>
        set({
          stages: get().stages.map((s) =>
            s.id === stageId
              ? {
                  ...s,
                  checklist: [
                    ...s.checklist,
                    { id: uid("ci"), title, done: false, isCustom: true },
                  ],
                }
              : s
          ),
        }),

      setStageStatus: (stageId, status) =>
        set({
          stages: get().stages.map((s) =>
            s.id === stageId ? { ...s, status } : s
          ),
        }),

      setStageNote: (stageId, note) =>
        set({
          stages: get().stages.map((s) =>
            s.id === stageId ? { ...s, note } : s
          ),
        }),

      confirmStagePayment: (stageId, amount) => {
        const stage = get().stages.find((s) => s.id === stageId);
        if (!stage) return;
        set({
          stages: get().stages.map((s) =>
            s.id === stageId ? { ...s, paymentConfirmed: true } : s
          ),
          expenses: [
            {
              id: uid("e"),
              amount,
              description: `Thanh toán đợt – ${stage.name}`,
              category: expenseCategoryForStageOrder(stage.order),
              date: new Date().toISOString().slice(0, 10),
            },
            ...get().expenses,
          ],
        });
      },

      toggleAskedQuestion: (stageId, questionId) =>
        set({
          stages: get().stages.map((s) => {
            if (s.id !== stageId) return s;
            const current = s.askedQuestionIds ?? [];
            const askedQuestionIds = current.includes(questionId)
              ? current.filter((id) => id !== questionId)
              : [...current, questionId];
            return { ...s, askedQuestionIds };
          }),
        }),

      addJournalEntry: (e) =>
        set({ journal: [{ ...e, id: uid("j") }, ...get().journal] }),

      setIssueStatus: (id, status, note) =>
        set({
          journal: get().journal.map((j) =>
            j.id === id
              ? {
                  ...j,
                  issueStatus: status,
                  issueHistory: [
                    ...(j.issueHistory ?? []),
                    {
                      date: new Date().toISOString().slice(0, 10),
                      status,
                      note,
                    },
                  ],
                }
              : j
          ),
        }),

      addDocument: (d) =>
        set({ documents: [{ ...d, id: uid("d") }, ...get().documents] }),
      renameDocument: (id, name) =>
        set({
          documents: get().documents.map((d) =>
            d.id === id ? { ...d, name } : d
          ),
        }),
      deleteDocument: (id) =>
        set({ documents: get().documents.filter((d) => d.id !== id) }),

      addMaterial: (m) =>
        set({ materials: [{ ...m, id: uid("m") }, ...get().materials] }),
      updateMaterial: (id, patch) =>
        set({
          materials: get().materials.map((m) =>
            m.id === id ? { ...m, ...patch } : m
          ),
        }),
      deleteMaterial: (id) =>
        set({ materials: get().materials.filter((m) => m.id !== id) }),

      addTask: (t) =>
        set({ tasks: [{ ...t, id: uid("t"), done: false }, ...get().tasks] }),
      toggleTask: (id) =>
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, done: !t.done } : t
          ),
        }),

      addContact: (c) =>
        set({ contacts: [{ ...c, id: uid("ct"), reviews: [] }, ...get().contacts] }),
      updateContact: (id, patch) =>
        set({
          contacts: get().contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }),
      deleteContact: (id) =>
        set({ contacts: get().contacts.filter((c) => c.id !== id) }),

      addContactReview: (contactId, review) =>
        set({
          contacts: get().contacts.map((c) =>
            c.id === contactId
              ? { ...c, reviews: [{ ...review, id: uid("rv") }, ...c.reviews] }
              : c
          ),
        }),
      deleteContactReview: (contactId, reviewId) =>
        set({
          contacts: get().contacts.map((c) =>
            c.id === contactId
              ? { ...c, reviews: c.reviews.filter((r) => r.id !== reviewId) }
              : c
          ),
        }),

      addRoom: (name) =>
        set({ rooms: [...get().rooms, { id: uid("room"), name }] }),
      deleteRoom: (id) =>
        set({
          rooms: get().rooms.filter((r) => r.id !== id),
          evidenceRecords: get().evidenceRecords.filter((e) => e.roomId !== id),
        }),

      addEvidenceRecord: (e) =>
        set({
          evidenceRecords: [{ ...e, id: uid("ev") }, ...get().evidenceRecords],
        }),
      deleteEvidenceRecord: (id) =>
        set({ evidenceRecords: get().evidenceRecords.filter((e) => e.id !== id) }),
    }),
    {
      name: "nha-minh-store",
    }
  )
);
