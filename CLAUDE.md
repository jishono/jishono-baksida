# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Admin and collaboration frontend for [jisho.no](https://jisho.no), a Norwegian-Japanese dictionary. Users can make/edit/vote on translation suggestions; admin users can edit dictionary data directly.

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Production build
npm run preview   # Preview production build locally
```

No test suite is configured.

## Environment

Copy `.env` for local development. Key variable:

- `VITE_NODE_HOST` — Backend API base URL (local: `http://localhost:3001/`, production: `https://api.jisho.no`)

## Architecture

**Stack:** Vue 3 + Vuetify 3 + Vuex 4 + Vue Router 4 + Vite

**Entry point:** `src/main.js` mounts the app with router, vuetify, store, and i18n.

**API layer (`src/api.js`):** Axios instance configured with `VITE_NODE_HOST` as `baseURL`. Automatically attaches the JWT token from Vuex store to every request via a request interceptor.

**Data service (`src/services/JishoDataService.js`):** Single class wrapping all API calls. Imported directly by components and the store.

**Store (`src/store/index.js`):** Single Vuex module managing auth state (token, username, user_id, admin), locale, snackbar, and unseen wall-post count. Auth tokens are persisted in `localStorage`.

**Router (`src/router.js`):** Routes use Norwegian names (e.g. `/forslag`, `/sok`, `/endre/:id`). Route guard redirects unauthenticated users to `/logginn` for `requiresAuth` routes.

**i18n (`src/i18n.js`):** Supports Norwegian (`no`) and Japanese (`ja`) locales. Message files are in `src/locales/`.

**Components (`src/components/`):** Shared components — `Navbar`, `Snackbar`, `Boyningstabell` (conjugation table), `ForslagKommentarer`, `InstruksBoks`, `LineChart`, `LineChartHistory`.

**Views (`src/views/`):** Page-level components corresponding to routes. Named in Norwegian (e.g. `Forslag.vue`, `Oversett.vue`, `Statistikk.vue`).

**Mixins (`src/mixins/helpers.js`):** Provides `addFurigana()` for rendering Japanese furigana from bracket notation (e.g. `漢字[かんじ]`), `randomFarge()` for avatar colours, and `escapeHTML()`.

**Vuetify config (`src/plugins/vuetify.js`):** Light/dark themes with fixed brand colours (primary `#1565c0`, accent `#d50000`).

## Language Conventions

Route paths, variable names, method names, and store keys use Norwegian. UI strings go in the locale JSON files under `src/locales/`.

## Deployment

`public/_redirects` handles SPA routing (Netlify-style redirect). Production build targets `https://api.jisho.no` via `.env.production`.
