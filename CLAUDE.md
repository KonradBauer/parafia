# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Zasady pracy

Pracuj ze mną wyłącznie w trybie planowania i iteracyjnego doprecyzowania problemu.
Nie przechodź do realizacji, dopóki wyraźnie Cię o to nie poproszę.

1. Najpierw krótko opisz, co zrozumiałeś i jakie jest zadanie.
2. Wypisz jawnie wszystkie założenia.
3. Poczekaj na weryfikację lub korektę.
4. Zaproponuj plan rozwiązania (bez realizacji) — co, jak, dlaczego.
5. Oceń pewność (1–10) dla: zrozumienia problemu i trafności rozwiązania. Jeśli < 7 — przemyśl ponownie.
6. Realizuj etapami — czekaj na zgodę przed każdym.
7. Jeśli brakuje danych, problem jest niejednoznaczny lub wymagania sprzeczne — zatrzymaj się i zakomunikuj.

## Stan produkcji

Szczegóły wdrożenia VPS, konfiguracji Apache/PM2 i lista TODO znajdują się w `prod.md`.

## Komendy

```bash
# Development (wszystko naraz)
npm run dev

# Poszczególne serwisy
npm run dev:frontend    # Vite port 5173
npm run dev:backend     # Express port 3001 (--watch)
npm run dev:admin       # Vite port 5174

# Build
npm run build           # frontend + admin
npm run build:frontend  # → dist/
npm run build:backend   # → backend/admin-dist/

# Produkcja
npm run start           # cd backend && node server.js

# Instalacja zależności (root + backend + admin)
npm run install:all
```

Brak testów w projekcie.

## Architektura

Monorepo z trzema aplikacjami i jednym backendem:

```
Frontend (React 18 + Vite + Tailwind)
  → publiczna strona parafii, port 5173 (dev)
  → src/services/api.js — klient API (VITE_API_URL || '/api')
  → src/hooks/useApi.js — hooki React do pobierania danych

Backend (Express + SQLite via better-sqlite3)
  → port 3001, API pod /api
  → serwuje frontend z backend/public/, admin z backend/admin-dist/
  → backend/db.js — schemat bazy, auto-inicjalizacja tabel z danymi domyślnymi
  → backend/routes.js — wszystkie endpointy API
  → backend/auth.js — JWT (7 dni), jeden użytkownik admin z .env

Admin Panel (React 18 + Vite + Radix UI + Tailwind)
  → panel CMS pod /admin, port 5174 (dev)
  → backend/admin/src/services/api.js — klient API z auto-JWT
  → auto-logout przy 401/403
```

## Kluczowe wzorce

- **Sanityzacja** (`backend/middleware/sanitize.js`): Wszystkie POST/PUT oczyszczane z XSS. Pola HTML (content, description) — dozwolone `<p>, <br>, <strong>, <em>, <ul>, <ol>, <li>, <a>, <h3>, <h4>`. Reszta — strip all HTML.
- **Walidacja** (`backend/utils/validators.js`): Schematy express-validator per endpoint.
- **Rate limiting**: 100 req/15min (prod), 5 prób logowania/15min.
- **Upload**: JPEG/PNG/GIF/WebP, max 5MB, serwowane z `/uploads/`.

## Baza danych (SQLite)

14 tabel: `announcements`, `intention_months`, `intentions`, `mass_times`, `priests`, `priests_from_parish`, `gallery_categories`, `gallery`, `history`, `events`, `parish_info`, `about_section`, `history_about`, `contact_messages`.

Singletony (jeden rekord): `parish_info`, `about_section`, `history_about`.

## API

- **Publiczne**: GET na wszystkich zasobach + POST `/api/contact-messages`
- **Chronione** (JWT Bearer): pełny CRUD, upload plików, zarządzanie wiadomościami
- **Auth**: POST `/api/auth/login`, GET `/api/auth/verify`

## Deploy pipeline

1. `npm run build:frontend` → `dist/`
2. `cp -r dist/* backend/public/` (ręczne)
3. `npm run build:backend` → `backend/admin-dist/`
4. PM2: `pm2 start server.js --name parafia-cms --env NODE_ENV=production`
5. Apache reverse proxy: port 80 → 127.0.0.1:3001
