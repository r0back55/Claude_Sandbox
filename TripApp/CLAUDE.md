# TripApp — Development Log

This file tracks the development progress of TripApp for continuity across Claude sessions.

---

## Project Overview

A real-time group travel tracking web app.
- **Repo:** https://github.com/r0back55/Claude_Sandbox (subfolder: `TripApp/`)
- **Live:** https://tripapp-53122.web.app
- **Local dev:** `cd D:\Claude\TripApp && npm run dev`
- **Deploy:** `npm run build && firebase deploy --only hosting` (or push to master — CI/CD auto-deploys)
- **Firebase project:** `tripapp-53122`

---

## Current Status

Production-ready. CI/CD active. All planned features implemented and tested on desktop + mobile (iOS Safari + Android Chrome).

---

## Completed Work

### Infrastructure
- [x] Git repo at `D:\Claude` connected to GitHub (`r0back55/Claude_Sandbox`)
- [x] React + Vite + TypeScript project scaffolded in `TripApp/`
- [x] Tailwind CSS v4 via `@tailwindcss/vite` plugin
- [x] Firebase project connected (Auth + Realtime Database + Hosting)
- [x] Firebase Realtime Database security rules configured (see below)
- [x] Deployed to Firebase Hosting (`https://tripapp-53122.web.app`)
- [x] CI/CD — GitHub Actions auto-deploy on push to master (`TripApp/**`)
- [x] PWA — installable, service worker via vite-plugin-pwa, OSM tile caching
- [x] Code splitting — vendor-react, vendor-firebase, vendor-map + lazy page loading
- [x] Error boundary — graceful fallback UI on crash

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
- [x] Unique colored markers per participant with initials (8 color palette, shared via `utils/colors.ts`)
- [x] Smooth marker animation (ease-in-out, 1 second, via requestAnimationFrame)
- [x] Map auto-fit — fitBounds on all participants + destination on every location update
- [x] Speed indicator — Haversine calc between consecutive GPS fixes; green dot (≥5 km/h) / red dot (stopped)
- [x] Stale location indicator — marker grays out + "last seen X min ago" if no update in 5+ min; 30s interval in UserMarker keeps label fresh
- [x] Route overlay per participant in matching color (OSRM, free)
- [x] ETA panel — collapsible drawer, ranked by ETA, leader badge, gap display, "Arrived ✓" within 100m
- [x] ETA panel color dots — match marker colors via shared `utils/colors.ts`
- [x] Custom destination marker (dark circle with star icon)
- [x] Meeting point pin — organizer drops ☕ pin on map; stored in Firebase; visible to all; organizer can remove from popup; button always visible in VoteBanner (both vote and no-vote states)
- [x] Empty state on map when no locations shared yet
- [x] Notifications: joined, arrived, stopped 10+ min, all arrived
- [x] Background location warning banner with Refresh button
- [x] Group chat — real-time Firebase messaging, iMessage-style bubbles, unread badge persisted in localStorage
- [x] Rest stop voting — propose/yes/no/close, live progress bar, anyone can propose
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
| Map click handler | useMap + map.on/off + useRef | More reliable than useMapEvents (stale closure issues) |
| PWA | vite-plugin-pwa + Workbox generateSW | Zero-config service worker, OSM tile caching |

---

## Firebase Configuration

- **Auth providers:** Google, Anonymous
- **Database rules:** granular per-field rules (see README.md for full JSON)
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
        speed?: number         (km/h, Haversine between consecutive GPS fixes)
    messages/
      {pushId}/
        uid: string
        name: string
        text: string
        sentAt: number
    vote/
      status: 'active' | 'closed'
      proposedBy: string
      proposedByUid: string
      createdAt: number
      votes/
        {uid}: 'yes' | 'no'
    restStop/
      lat: number
      lng: number
```

### Security Rules — paths covered
- `organizerId` — write once by creator
- `destination`, `status` — organizer only
- `participants/{uid}` — each user writes their own
- `messages`, `vote`, `restStop` — any authenticated user

---

## Known Issues / Technical Debt

- OSRM public demo server — should be self-hosted for production at scale
- Nominatim public server — rate limits, fine for demos
- Geolocation only works on HTTPS (not local HTTP on mobile)
- Background location not supported (browser limitation) — warned in UI
- No loading skeleton screens
- No trip expiry — old trips accumulate in Firebase indefinitely

---

## Roadmap (Next Steps)

- [ ] Trip summary screen (who arrived first, total duration)
- [ ] Trip expiry / Firebase cleanup (auto-delete after 24h)
- [ ] Offline fallback screen
- [ ] Push notifications (VAPID + service worker)
- [ ] Trip history / past trips
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

# Deploy to Firebase Hosting (manual)
firebase deploy --only hosting

# Type check
npx tsc --noEmit

# Get Firebase CI token (one-time, for GitHub Actions secret)
npx firebase-tools login:ci
```
