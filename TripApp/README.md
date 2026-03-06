# TripApp

A real-time group travel tracking web app. Set a shared destination, share a trip code or direct link with your group, and see everyone's live location on a map — with ETA for each participant.

**Live demo:** https://tripapp-53122.web.app

---

## Features

- **Google login** for trip organizers
- **Nickname-based joining** — participants join with a code or direct link, no account needed
- **Shareable invite link** — organizer can copy a direct link, friends only need to enter their name
- **Live location sharing** — updates every minute via browser geolocation
- **Manual refresh** — button to force an immediate location update
- **Interactive map** — each participant shown as a unique colored marker with initials
- **Smooth marker animation** — markers glide to new positions instead of jumping
- **Map auto-fit** — map automatically zooms and pans to keep all participants in view
- **Speed indicator** — colored dot on each marker (green = moving, red = stopped); speed shown in popup
- **Route overlay** — remaining path to destination drawn per participant in matching color
- **ETA panel** — collapsible, shows estimated time and distance per participant with matching color dots
- **Arrived indicator** — shows green "Arrived ✓" when participant is within 100m of destination
- **Group chat** — real-time in-trip messaging with unread badge counter
- **Rest stop voting** — any participant can propose a rest stop; live Yes/No vote with progress bar
- **Smart notifications** — alerts when someone arrives, stops moving, or joins
- **Organizer controls** — start trip, end trip for all participants
- **Participant controls** — exit trip independently
- **Copy trip code** — one-tap copy button in the lobby
- **Participant count badge** — Start Trip button shows how many people are ready
- **Loading spinner** — shown while GPS fix is being acquired on first load
- **Empty map state** — friendly message when no locations have been shared yet
- **Mobile ready** — responsive design, works on iOS and Android browsers (HTTPS required for geolocation)

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
        }
      }
    }
  }
}
```

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
│   ├── Map/
│   │   ├── TripMap.tsx           # Main Leaflet map + empty state
│   │   ├── UserMarker.tsx        # Animated participant marker
│   │   └── RouteLayer.tsx        # Route polyline to destination
│   ├── Notifications/
│   │   └── NotificationToast.tsx # Auto-dismissing toast
│   └── Trip/
│       ├── CreateTrip.tsx        # Create trip form
│       ├── DestinationSearch.tsx # City search via Nominatim
│       ├── DestinationMap.tsx    # Clickable map for destination
│       ├── ETAPanel.tsx          # Collapsible ETA list per participant
│       └── ParticipantList.tsx   # Lobby participant list
├── context/
│   ├── AuthContext.tsx           # Firebase auth state
│   └── TripContext.tsx           # Active trip state
├── hooks/
│   ├── useLocation.ts            # Geolocation + speed calc + 1min publish + manual refresh
│   ├── useNotifications.ts       # Arrival/stop/join alerts
│   ├── useTrip.ts                # Firebase trip subscription
│   ├── useChat.ts                # Real-time chat messages subscription
│   └── useVote.ts                # Real-time rest stop vote subscription
├── pages/
│   ├── Landing.tsx               # Login / join page
│   ├── Dashboard.tsx             # Organizer: create trip
│   ├── Lobby.tsx                 # Waiting room
│   ├── Trip.tsx                  # Active trip map view
│   └── Join.tsx                  # Direct invite link landing
├── services/
│   ├── firebase.ts               # Firebase init
│   ├── location.ts               # Read/write locations to Firebase
│   ├── routing.ts                # OSRM ETA + Nominatim reverse geocode
│   ├── chat.ts                   # Send/subscribe to chat messages
│   └── vote.ts                   # Propose/cast/close rest stop votes
├── utils/
│   └── colors.ts                 # Shared participant color palette
└── types.ts                      # Shared TypeScript interfaces
```

---

## Known Limitations

- **Background location:** Mobile browsers suspend JavaScript when the app is in the background. Use the **Refresh** button when returning to the app, or keep the screen on.
- Location requires **HTTPS** — works on Firebase Hosting, not on local HTTP for mobile.

---

## Roadmap

- [ ] CI/CD via GitHub Actions
- [ ] Push notifications (PWA)
- [ ] Trip history
- [ ] Offline support
- [ ] Code splitting (reduce bundle size)

---

## License

MIT
