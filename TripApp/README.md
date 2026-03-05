# TripApp

A real-time group travel tracking web app. Set a shared destination, share a trip code with your group, and see everyone's live location on a map — with ETA for each participant.

**Live demo:** https://tripapp-53122.web.app

---

## Features

- **Google login** for trip organizers
- **Nickname-based joining** — participants join with a code, no account needed
- **Live location sharing** — updates every minute via browser geolocation
- **Interactive map** — each participant shown as a marker with their name
- **Route overlay** — remaining path to destination drawn for each participant
- **ETA panel** — estimated time and distance to destination for everyone
- **Smart notifications** — alerts when someone arrives, stops moving, or joins
- **Organizer controls** — start trip, end trip for all participants
- **Participant controls** — exit trip independently
- **Mobile ready** — responsive design, works on iOS and Android browsers

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
Set destination (city search)      Join lobby
Share trip code                    Wait for organizer
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

---

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── GoogleLogin.tsx       # Google sign-in button
│   │   └── NicknameForm.tsx      # Guest join form
│   ├── Map/
│   │   ├── TripMap.tsx           # Main Leaflet map
│   │   ├── UserMarker.tsx        # Participant pin
│   │   └── RouteLayer.tsx        # Route polyline to destination
│   ├── Notifications/
│   │   └── NotificationToast.tsx # Auto-dismissing toast
│   └── Trip/
│       ├── CreateTrip.tsx        # Create trip form
│       ├── DestinationSearch.tsx # City search via Nominatim
│       ├── ETAPanel.tsx          # ETA list per participant
│       └── ParticipantList.tsx   # Lobby participant list
├── context/
│   ├── AuthContext.tsx           # Firebase auth state
│   └── TripContext.tsx           # Active trip state
├── hooks/
│   ├── useLocation.ts            # Geolocation + 1min publish
│   ├── useNotifications.ts       # Arrival/stop/join alerts
│   └── useTrip.ts                # Firebase trip subscription
├── pages/
│   ├── Landing.tsx               # Login / join page
│   ├── Dashboard.tsx             # Organizer: create trip
│   ├── Lobby.tsx                 # Waiting room
│   └── Trip.tsx                  # Active trip map view
├── services/
│   ├── firebase.ts               # Firebase init
│   ├── location.ts               # Read/write locations to Firebase
│   └── routing.ts                # OSRM ETA calls
└── types.ts                      # Shared TypeScript interfaces
```

---

## Roadmap

- [ ] CI/CD via GitHub Actions
- [ ] Map click to set destination
- [ ] Push notifications (PWA)
- [ ] Trip history
- [ ] Custom participant avatars/colors on map
- [ ] Offline support

---

## License

MIT
