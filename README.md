# Nhà Mình

> "Xây nhà an tâm, mọi thứ trong tầm tay."

A mobile-first UI/UX prototype for a friendly home-construction companion app for everyday Vietnamese homeowners. Phase 1: frontend-only, demo data persisted to `localStorage`, no backend.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-variable design tokens)
- Zustand (with `persist` middleware for localStorage)
- Lucide icons, `motion` for animation, `sonner` for toasts

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Best viewed at a 390px-wide mobile viewport (DevTools device toolbar), but it's responsive from 360px up to desktop.

```bash
npm run build   # production build
npm run lint     # eslint
```

## Structure

```
src/
  app/
    onboarding/            welcome + 3-step setup wizard
    (app)/                 route group with bottom-nav shell
      home/                "Hôm nay" dashboard
      expenses/            "Chi phí" — budget + expense CRUD
      progress/            "Tiến độ" — milestone timeline + checklists
      journal/             "Nhật ký" — photo journal, issues, before/after
      profile/             "Hồ sơ" — Tài liệu / Vật liệu đã chọn
      settings/            home profile + reset demo
  components/
    ui/                    Button, Card, Sheet, ConfirmDialog, CurrencyInput, ...
    layout/                BottomNavigation, QuickAddSheet, PageHeader, AppShell
    dashboard/, expense/, progress/, journal/, profile/, tasks/
  lib/
    types.ts               data model (home, expense, stage, journal, document, material, task)
    mock-data.ts           coherent Vietnamese demo dataset
    store.ts                zustand store + localStorage persistence + all CRUD actions
    calculations.ts        progress %, budget totals (single source of truth)
    format.ts, meta.ts, utils.ts, toast.ts
```

## Implemented

- Onboarding: welcome screen + 3-step wizard ("Bắt đầu ngay") or instant demo data ("Khám phá bản demo")
- Home dashboard: progress card, budget summary, up to 3 tasks, issue banner, quick actions
- Expenses: search/filter by category, add/edit/delete with confirmation, currency formatting, live budget recalculation
- Progress: 6-stage vertical timeline, per-stage checklist (toggle/add custom item), stage status, notes
- Journal: photo-journal feed, 4 entry types, issue tracking with status history, "Trước & Sau" photo comparison
- Hồ sơ: Tài liệu (add/rename/delete) and Vật liệu đã chọn (add/edit/delete, "Đang cân nhắc" ↔ "Đã chốt")
- Global "+" quick-add (Chi tiền / Chụp ảnh / Ghi sự cố / Thêm việc) reachable from the bottom nav and the dashboard
- Settings: home profile summary, reload demo data, reset all data (with confirmation)
- All demo data persists to `localStorage`; empty states, toasts, and confirmation dialogs throughout
- Installable as a PWA (manifest + icon); responsive from 360px to desktop

## Known limitations (Phase 1 scope)

- No real backend, auth, or file storage — everything lives in the browser's `localStorage`
- Document/expense attachments only store a file name (or a data-URL for journal/material photos), not real uploads
- Notifications bell is a visual placeholder (no real notification system)
- Designed so the data layer (`lib/types.ts`, `lib/store.ts`) can be swapped for a real backend (e.g. Supabase) without a UI rewrite
