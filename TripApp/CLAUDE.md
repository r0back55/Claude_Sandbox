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

Production-ready. All planned features implemented, styled, tested on desktop and mobile (iOS Safari + Chrome). UI improvements list fully completed.

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
- [x] Map click to set destination (reverse geocoding via Nominatim)
- [x] Lobby with trip code display and participant list
- [x] Copy trip code button (clipboard, shows "Copied!" feedback)
- [x] Copy invite link button — direct URL, friend only needs to enter name
- [x] `/join/:tripId` page for direct invite links
- [x] Start Trip button disabled until at least 1 participant joins, shows count badge
- [x] Organizer can start trip → all participants redirected to map
- [x] Live location sharing (browser geolocation, updates every 1 minute)
- [x] Manual "Refresh" button to force immediate location update
- [x] Loading spinner overlay while GPS fix is being acquired
- [x] Interactive map (Leaflet + OpenStreetMap)
- [x] Unique colored markers per participant with initials (8 color palette)
- [x] Smooth marker animation (ease-in-out, 1 second, via requestAnimationFrame)
- [x] Route overlay per participant in matching color (OSRM, free)
- [x] ETA panel per participant — collapsible drawer, shows "Arrived ✓" when within 100m
- [x] Custom destination marker (dark circle with star icon)
- [x] Empty state on map when no locations shared yet
- [x] Notifications: joined, arrived, stopped 10+ min, all arrived
- [x] Background location warning banner with Refresh button
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
| Marker animation | requestAnimationFrame + setLatLng | No extra deps, smooth performance |

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

- OSRM public demo server — should be self-hosted for production at scale
- Nominatim public server — has rate limits, fine for PoC
- Bundle size warning (~672KB) — needs code splitting
- Geolocation only works on HTTPS (not local HTTP on mobile)
- Background location not supported (browser limitation) — warned in UI
- No error boundary components yet
- No loading skeleton screens

---

## Roadmap (Next Steps)

### Next up
- [ ] **CI/CD** — GitHub Actions auto-deploy to Firebase on push to `master`

### Backlog
- [ ] Push notifications (PWA / service worker)
- [ ] Trip history / past trips
- [ ] Offline support
- [ ] Code splitting (fix bundle size warning)
- [ ] Error boundaries
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
