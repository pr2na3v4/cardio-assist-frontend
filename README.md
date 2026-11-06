# CardioAssist AI — Frontend

AI-Powered Cardiac Risk Segmentation, Follow-Up Management & Healthcare
Assistant. React + Vite + Tailwind CSS SaaS frontend for the FastAPI
cardiac risk backend.

## Tech Stack

- React 18 + Vite
- React Router v6
- Axios (centralized API client)
- Chart.js via react-chartjs-2
- React Hook Form
- Tailwind CSS
- react-helmet-async (per-page SEO)

## Backend Endpoints Used

```
GET  /dashboard/stats
POST /patients
GET  /patients
POST /predict
GET  /history
GET  /followups
GET  /followups/today
```

## Folder Structure

```
src/
├── main.jsx                 # App entry: Router + Helmet + Toast providers
├── App.jsx                  # Route table
├── index.css                 # Tailwind + design-token component classes
├── components/
│   ├── Navbar.jsx             # Marketing-site nav
│   ├── Sidebar.jsx            # In-app nav (responsive drawer on mobile)
│   ├── Footer.jsx              # Marketing-site footer
│   ├── StatCard.jsx            # Dashboard metric card
│   ├── PatientForm.jsx          # Patient registration form
│   ├── PredictionForm.jsx       # Prediction inputs + patient selector
│   ├── RiskCard.jsx             # Prediction result display
│   ├── RiskBadge.jsx            # Color-coded risk level pill
│   ├── PulseLine.jsx            # Signature ECG trace (hero/divider/loader)
│   ├── Modal.jsx, Pagination.jsx, Seo.jsx
│   ├── Skeleton.jsx, EmptyState.jsx, ErrorState.jsx
│   ├── charts/
│   │   ├── RiskDistributionChart.jsx     # Donut: risk level mix
│   │   ├── PatientDistributionChart.jsx  # Bar: predictions by cluster
│   │   └── FollowupAnalyticsChart.jsx    # Line: follow-up load, next 7 days
│   └── tables/
│       ├── PatientTable.jsx
│       ├── HistoryTable.jsx
│       └── FollowupTable.jsx
├── pages/
│   ├── Home.jsx        # Landing page: hero, features, benefits, how-it-works
│   ├── Dashboard.jsx    # Stat cards + 3 charts
│   ├── Patients.jsx     # Registration + searchable/paginated roster
│   ├── Prediction.jsx   # Form + result card
│   ├── FollowUps.jsx    # Today / Upcoming tabs, color-coded by risk
│   ├── History.jsx      # Search/filter/sort/paginate + details modal
│   └── NotFound.jsx     # 404
├── services/
│   └── api.js            # Centralized Axios client + normalized errors
├── hooks/
│   ├── useToast.jsx       # Toast notification system
│   ├── useFetch.js        # Generic async data hook (loading/error/data)
│   └── usePagination.js   # Client-side pagination
├── utils/
│   ├── riskUtils.js       # Risk-level labels/colors (Healthy/Moderate/High/Critical)
│   └── dateUtils.js       # Formatting + follow-up countdown
└── layouts/
    ├── MarketingLayout.jsx  # Navbar + Footer wrapper (Home page)
    └── AppLayout.jsx        # Sidebar + topbar wrapper (all in-app pages)
```

## Design System

- **Color**: deep clinical teal-navy (`ink-700 #0B3B45`) as the primary/trust
  color, a crimson-rose "pulse" accent (`#E33F5C`, literally the color of an
  ECG trace) used sparingly for emphasis and critical states, and a
  four-level risk scale (green/yellow/orange/red) used consistently for
  Healthy/Moderate/High/Critical everywhere in the app.
- **Type**: Fraunces (display/headings), Inter (UI/body), IBM Plex Mono
  (clinical data — heart rate, BP, cluster IDs).
- **Signature element**: `<PulseLine />` — an animated ECG trace used in
  the hero (draws itself on load), as a section divider, and as a loading
  indicator. It's literal to the subject matter and doubles as a
  recognizable brand mark.

All design tokens (colors, shadows, radii, animations) live in
`tailwind.config.js`; component-level classes (`.card`, `.btn-*`,
`.field-*`, `.skeleton`, `.glass`) live in `src/index.css`.

## Local Setup

```bash
npm install
cp .env.example .env
# edit .env: point VITE_API_URL at your running FastAPI backend

npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

## Notes on `/predict`

The backend's `POST /predict` requires a `patient_id` — a patient must
already exist. The Prediction page therefore includes a patient selector
(populated from `GET /patients`) in addition to the five clinical inputs
(Age, Blood Pressure, Cholesterol, Max Heart Rate, OldPeak) specified in
the brief. `RiskCard` renders the exact nested response shape the backend
returns: `{ prediction, followup, reminder }`.

## Accessibility

- All interactive controls have visible focus states (`:focus-visible`
  outline in the brand accent color).
- Form fields use `<label htmlFor>`, `aria-invalid`, and
  `aria-describedby` wired to inline error messages.
- Toasts and modals use `role="status"` / `role="dialog"` with
  `aria-live` / `aria-modal` as appropriate; modals trap Escape-to-close
  and return focus.
- Color is never the only signal for risk level — every risk badge also
  carries a text label.
- Respects `prefers-reduced-motion` (disables animations/transitions).

## SEO

- `index.html` carries site-wide meta title/description, Open Graph,
  Twitter Card, and two JSON-LD blocks (`MedicalWebPage` +
  `SoftwareApplication`).
- Each page additionally sets its own title/description/canonical via
  `<Seo />` (react-helmet-async) for more specific search-result snippets.
- Semantic HTML throughout: one `<h1>` per page, ordered heading
  hierarchy, `<nav aria-label>`, `<table>` markup with `<th scope="col">`.
