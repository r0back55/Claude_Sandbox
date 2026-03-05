# TripApp — Development Log

This file tracks the development progress of TripApp for continuity across Claude sessions.

---

## Project Overview

A real-time group travel tracking web app.
- **Repo:** https://github.com/r0back55/Claude_Sandbox (subfolder: `TripApp/`)
- **Live:** https://tripapp-53122.web.app
- **Local dev:** `cd D:\Claude\TripApp && npm run dev`
- **Deploy:** `npm run build && firebase deploy --only hosting`
- **Firebase project:** `tripapp-53122`

---

## Current Status

Production-ready PoC. All core features working, styled, and deployed. Tested on desktop and mobile (iOS Safari + Chrome).

---

## Completed Work

### Infrastructure
- [x] Git repo at `D:\Claude` connected to GitHub (`r0back55/Claude_Sandbox`)
- [x] React + Vite + TypeScript project scaffolded in `TripApp/`
- [x] Tailwind CSS v4 via `@tailwindcss/vite` plugin
- [x] Firebase project connected (Auth + Realtime Database + Hosting)
- [x] Firebase Realtime Database security rules configured
- [x] Deployed to Firebase Hosting (`https://tripapp-53122.web.app`)

### Features
- [x] Google login for organizers
- [x] Anonymous auth (Firebase) for guest participants — join with nickname + trip code
- [x] Trip creation with city search (Nominatim geocoding, no API key needed)
- [x] Lobby with trip code display and participant list
- [x] Copy trip code button (clipboard, shows "Copied!" feedback)
- [x] Start Trip button disabled until at least 1 participant joins, shows count badge
- [x] Organizer can start trip → all participants redirected to map
- [x] Live location sharing (browser geolocation, updates every 1 minute)
- [x] Interactive map (Leaflet + OpenStreetMap)
- [x] Unique colored markers per participant with initials (8 color palette)
- [x] Route overlay per participant in matching color (OSRM, free)
- [x] ETA panel per participant — collapsible drawer, shows "Arrived ✓" when within 100m
- [x] Custom destination marker (dark circle with star icon)
- [x] Notifications: joined, arrived, stopped 10+ min, all arrived
- [x] Organizer "End Trip" button
- [x] Participant "Exit Trip" button (removes from Firebase, redirects to landing)
- [x] Mobile viewport fix (`100dvh`)
- [x] Map padding with rounded corners
- [x] TypeScript migration with strict mode
- [x] Full UI styling with Tailwind

---

## Architecture Decisions

| Decision | Choice | Reason |
|---|---|---|
| Auth for guests | Firebase Anonymous Auth | Real UID needed for security rules |
| Maps | Leaflet + OpenStreetMap | Free, no API key |
| Routing/ETA | OSRM public server | Free, no API key |
| Geocoding | Nominatim | Free, no API key |
| Realtime | Firebase Realtime DB | Simple, free tier, built-in sync |
| Styling | Tailwind CSS v4 | Fast, scalable |

---

## Firebase Configuration

- **Auth providers:** Google, Anonymous
- **Database rules:** granular per-field rules (see README.md)
- **Hosting:** `dist/` folder, SPA rewrite enabled

### Database Structure
```
trips/
  {tripId}/
    organizerId: string
    status: 'lobby' | 'active' | 'ended'
    destination/
      lat: number
      lng: number
      name: string
    participants/
      {uid}/
        lat: number
        lng: number
        name: string
        updatedAt: number
```

---

## Known Issues / Technical Debt

- OSRM public demo server used — should be self-hosted for production at scale
- Nominatim public server used — has rate limits, fine for PoC
- Bundle size warning (672KB) — needs code splitting for production
- Geolocation only works on HTTPS (not local HTTP on mobile)
- No error boundary components yet
- No loading skeleton screens

---

## Roadmap (Next Steps)

### Next up
- [ ] **Step 5: CI/CD** — GitHub Actions auto-deploy to Firebase on push to `master`

### Backlog
- [ ] Map click to set destination
- [ ] Push notifications (PWA / service worker)
- [ ] Trip history / past trips
- [ ] Offline support
- [ ] Code splitting (fix bundle size warning)
- [ ] Error boundaries
- [ ] Loading skeleton screens
- [ ] Self-hosted OSRM

---

## Environment Variables

Stored in `D:\Claude\TripApp\.env` (not committed). See `.env.example` for keys needed.

---

## Key Commands

```bash
# Start dev server
cd D:\Claude\TripApp && npm run dev

# Build
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Type check
npx tsc --noEmit
```
