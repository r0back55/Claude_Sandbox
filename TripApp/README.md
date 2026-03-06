# TripApp

A real-time group travel tracking web app. Set a shared destination, share a trip code or direct link with your group, and see everyone's live location on a map — with ETA, chat, and rest stop coordination.

**Live demo:** https://tripapp-53122.web.app

---

## Features

### Map & Location
- **Interactive map** — each participant shown as a unique colored marker with initials
- **Live location sharing** — updates every minute via browser geolocation
- **Manual refresh** — button to force an immediate location update
- **Smooth marker animation** — markers glide to new positions instead of jumping
- **Map auto-fit** — automatically zooms and pans to keep all participants in view
- **Speed indicator** — colored dot on each marker (green = moving ≥5 km/h, red = stopped)
- **Stale location indicator** — marker grays out and shows "last seen X min ago" if no update in 5+ min
- **Route overlay** — remaining path to destination per participant in matching color
- **Loading spinner** — shown while GPS fix is being acquired

### ETA & Navigation
- **ETA panel** — collapsible, shows estimated time and distance per participant
- **ETA ranking** — sorted by arrival time, leader badge, gap behind leader
- **Arrived indicator** — shows green "Arrived ✓" when within 100m of destination
- **Color-matched dots** — ETA panel dots match map marker colors exactly

### Trip Coordination
- **Group chat** — real-time in-trip messaging with unread badge counter
- **Rest stop voting** — any participant can propose a rest stop; live Yes/No vote with progress bar
- **Meeting point pin** — organizer can drop a ☕ pin on the map as an agreed meetup point

### Trip Management
- **Google login** for trip organizers
- **Nickname-based joining** — participants join with a code or direct link, no account needed
- **Shareable invite link** — friends only need to enter their name
- **Organizer controls** — start trip, end trip for all participants
- **Participant controls** — exit trip independently
- **Participant count badge** — Start Trip button shows how many people are ready
- **Smart notifications** — alerts when someone joins, arrives, or stops moving

### Technical
- **PWA** — installable to home screen on Android and iOS
- **Offline-aware** — service worker caches app shell and map tiles
- **CI/CD** — auto-deploys to Firebase Hosting on every push to `master`
- **Code splitting** — vendor chunks (React, Firebase, Leaflet) loaded separately for faster first load
- **Error boundary** — graceful fallback UI instead of white screen on crash
- **Mobile ready** — responsive design, tested on iOS Safari and Android Chrome

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Auth | Firebase Authentication (Google + Anonymous) |
| Database | Firebase Realtime Database |
| Maps | Leaflet + OpenStreetMap |
| Routing & ETA | OSRM (open-source, free) |
| Geocoding | Nominatim (OpenStreetMap, free) |
| Hosting | Firebase Hosting |
| PWA | vite-plugin-pwa + Workbox |
| CI/CD | GitHub Actions |

---

## How It Works

```
Organizer                          Participants
─────────                          ────────────
Sign in with Google                Enter nickname + trip code
Set destination (search or         OR open direct invite link
click on map)                      and enter name only
Share trip code / link             Join lobby
Click "Start Trip"          →      Everyone redirected to map
See live map + ETAs                See live map + ETAs
Chat, vote on rest stops           Chat, vote on rest stops
Drop meeting point pin             See pin on map
Click "End Trip"            →      Trip ends for everyone
                                   (or click "Exit Trip" to leave early)
```

---

## Local Development

### Prerequisites
- Node.js 18+
- A Firebase project with **Google Auth**, **Anonymous Auth**, and **Realtime Database** enabled

### Setup

```bash
git clone https://github.com/r0back55/Claude_Sandbox.git
cd Claude_Sandbox/TripApp
npm install
```

Copy the environment file and fill in your Firebase config:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Start the dev server:

```bash
npm run dev
```

Open http://localhost:5173

### Firebase Realtime Database Rules

Set the following rules in your Firebase Console under **Realtime Database → Rules**:

```json
{
  "rules": {
    "trips": {
      "$tripId": {
        ".read": "auth != null",
        "organizerId": {
          ".write": "auth != null && !data.exists()"
        },
        "destination": {
          ".write": "auth != null && root.child('trips').child($tripId).child('organizerId').val() === auth.uid"
        },
        "status": {
          ".write": "auth != null && root.child('trips').child($tripId).child('organizerId').val() === auth.uid"
        },
        "participants": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid"
          }
        },
        "messages": {
          ".read": "auth != null",
          ".write": "auth != null"
        },
        "vote": {
          ".read": "auth != null",
          ".write": "auth != null"
        },
        "restStop": {
          ".write": "auth != null"
        }
      }
    }
  }
}
```

---

## CI/CD

Pushes to `master` that touch `TripApp/` automatically build and deploy via GitHub Actions.

Required GitHub repository secrets:

| Secret | Description |
|---|---|
| `FIREBASE_TOKEN` | From `npx firebase-tools login:ci` |
| `VITE_FIREBASE_API_KEY` | Firebase config values |
| `VITE_FIREBASE_AUTH_DOMAIN` | |
| `VITE_FIREBASE_DATABASE_URL` | |
| `VITE_FIREBASE_PROJECT_ID` | |
| `VITE_FIREBASE_STORAGE_BUCKET` | |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | |
| `VITE_FIREBASE_APP_ID` | |

---

## Deployment

```bash
npm run build
firebase deploy --only hosting
```

> Note: CDN propagation can take 1-2 minutes after deploy.

---

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── GoogleLogin.tsx       # Google sign-in button
│   │   └── NicknameForm.tsx      # Guest join form
│   ├── Chat/
│   │   └── ChatPanel.tsx         # iMessage-style chat panel
│   ├── Map/
│   │   ├── TripMap.tsx           # Main map, markers, rest stop pin, auto-fit
│   │   ├── UserMarker.tsx        # Animated marker with speed + stale indicator
│   │   └── RouteLayer.tsx        # Route polyline to destination
│   ├── Notifications/
│   │   └── NotificationToast.tsx # Auto-dismissing toast
│   ├── Trip/
│   │   ├── CreateTrip.tsx        # Create trip form
│   │   ├── DestinationSearch.tsx # City search via Nominatim
│   │   ├── DestinationMap.tsx    # Clickable map for destination
│   │   ├── ETAPanel.tsx          # Collapsible ETA list with color dots
│   │   └── ParticipantList.tsx   # Lobby participant list
│   ├── Vote/
│   │   └── VoteBanner.tsx        # Rest stop vote + meeting point pin button
│   └── ErrorBoundary.tsx         # Crash fallback UI
├── context/
│   ├── AuthContext.tsx            # Firebase auth state
│   └── TripContext.tsx            # Active trip state
├── hooks/
│   ├── useLocation.ts             # Geolocation + speed calc + 1min publish
│   ├── useNotifications.ts        # Arrival/stop/join alerts
│   ├── useTrip.ts                 # Firebase trip subscription
│   ├── useChat.ts                 # Real-time chat messages
│   ├── useVote.ts                 # Real-time rest stop vote
│   └── useRestStop.ts             # Real-time meeting point pin
├── pages/
│   ├── Landing.tsx                # Login / join page
│   ├── Dashboard.tsx              # Organizer: create trip
│   ├── Lobby.tsx                  # Waiting room
│   ├── Trip.tsx                   # Active trip map view
│   └── Join.tsx                   # Direct invite link landing
├── services/
│   ├── firebase.ts                # Firebase init
│   ├── location.ts                # Read/write locations to Firebase
│   ├── routing.ts                 # OSRM ETA + Nominatim geocoding
│   ├── chat.ts                    # Send/subscribe to messages
│   ├── vote.ts                    # Propose/cast/close votes
│   └── restStop.ts                # Set/clear/subscribe to meeting point
├── utils/
│   └── colors.ts                  # Shared participant color palette
└── types.ts                       # Shared TypeScript interfaces
```

---

## Known Limitations

- **Background location:** Mobile browsers suspend JavaScript when the app is in the background. Use the **Refresh** button when returning to the app, or keep the screen on.
- Location requires **HTTPS** — works on Firebase Hosting, not on local HTTP for mobile.
- OSRM and Nominatim are public demo servers — rate-limited, suitable for demos and small groups.

---

## Roadmap

- [ ] Trip summary screen (who arrived first, total duration)
- [ ] Push notifications (VAPID + service worker)
- [ ] Trip history / past trips
- [ ] Offline support
- [ ] Self-hosted OSRM

---

## License

MIT
