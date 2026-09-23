# URLZS Frontend

URLZS is a small React + Vite client for the URL shortener Spring Boot backend. It provides a clean public landing page and an authenticated dashboard for creating and managing short links.

The frontend is intentionally simple: React state, the native Fetch API, browser `localStorage`, and Tailwind CSS through its CDN/browser script.

## Features

- URLZS landing page with responsive layout.
- User registration and login.
- JWT persistence across page refreshes.
- Client-side logout and expired-session handling.
- Create short URLs.
- View paginated personal URLs.
- Refresh an individual URL record.
- Enable or disable a short link.
- Remove a URL from the user’s library.
- Display URL status and click count.
- Copy or open generated short URLs.
- Handle validation, authentication, conflict, rate-limit, server, and network errors.
- Responsive desktop table and mobile card layouts.

## Technology

- React
- Vite
- JavaScript
- Tailwind CSS via CDN
- Native browser Fetch API
- React built-in state and hooks

Tailwind is intentionally not installed as an npm dependency. There is no Tailwind, PostCSS, or CSS build pipeline in this project.

## Requirements

- Node.js 18 or newer
- npm
- A running instance of the URL shortener backend

## Setup

Install dependencies from this directory:

```bash
npm install
```

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

For local backend development, use:

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

For the deployed application, use:

```dotenv
VITE_API_BASE_URL=https://api.urlzs.xyz
```

The API base URL is read by `src/services/api.js`. It is not hardcoded throughout the application. The backend API uses `/api/v1`, while public short links use the backend root format `https://api.urlzs.xyz/{shortCode}`.

Anything beginning with `VITE_` is included in the browser bundle. Do not put secrets, database credentials, Redis credentials, or JWT signing keys in frontend environment variables.

## Development commands

Start the development server:

```bash
npm run dev
```

Build the production bundle:

```bash
npm run build
```

Run the production build locally:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

The production output is generated in `dist/`.

### Windows native binding repair

If Vite reports `Cannot find native binding` for `@rolldown/binding-win32-x64-msvc`, the existing `node_modules` was likely installed from a different operating system. From Windows Command Prompt, rebuild the generated dependency directory:

```bat
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev
```

The project declares the Windows Rolldown bindings as optional dependencies so a fresh Windows installation receives the correct native file. Do not copy `node_modules` between WSL/Linux and Windows; install dependencies separately on each operating system.

## Backend integration

The frontend communicates only with the public Spring Boot API. It does not connect directly to PostgreSQL, Supabase, Redis, or Upstash.

Current API calls include:

| Feature | Method | Endpoint |
|---|---|---|
| Register | `POST` | `/api/v1/users/register` |
| Login | `POST` | `/api/v1/users/login` |
| Create URL | `POST` | `/api/v1/urls` |
| List URLs | `GET` | `/api/v1/urls?page=0&size=20` |
| Get URL | `GET` | `/api/v1/urls/{urlId}` |
| Update status | `PATCH` | `/api/v1/urls/{urlId}` |
| Delete association | `DELETE` | `/api/v1/urls` |
| Public redirect | `GET` | `/{shortCode}` |

Protected requests send:

```http
Authorization: Bearer <jwt-token>
```

The backend must allow the frontend origin through CORS. The expected origins are:

- `http://localhost:5173` during local development;
- `https://urlzs.xyz` in production;
- `https://www.urlzs.xyz` only if that hostname serves the frontend.

The frontend expects normalized `400` and `401` responses from the backend, while rate-limit responses use `429` with a `Retry-After` header and may have an empty body.

## Project structure

```text
src/
├── App.jsx                 # Session persistence and simple page switching
├── main.jsx                # React entry point
├── index.css               # Small global reset/base styles
├── components/
│   ├── CopyButton.jsx
│   ├── ErrorBanner.jsx
│   ├── LoadingState.jsx
│   ├── Navbar.jsx
│   ├── StatusBadge.jsx
│   ├── UrlForm.jsx
│   ├── UrlList.jsx
│   └── UrlRow.jsx
├── pages/
│   ├── DashboardPage.jsx
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   └── RegisterPage.jsx
└── services/
    └── api.js              # Centralized Fetch API service layer
```

## Authentication behavior

After login, the returned `userId`, `email`, and JWT are stored in `localStorage` under `urlzs.session`. The session is restored after a page refresh.

Logout is client-side only because the backend currently has no JWT revocation or logout endpoint. When a protected request returns `401`, the frontend clears the session and returns the user to Login.

## Frontend routes

The app uses a lightweight browser History API router; no routing package is required.

| Path | Behavior |
|---|---|
| `/` | Redirects to `/dashboard` when logged in, otherwise `/login` |
| `/dashboard` | Protected dashboard; unauthenticated users are redirected to `/login` |
| `/login` | Login page |
| `/register` | Registration page |
| `/home` | Public landing page |

The root domain therefore opens the dashboard for an existing session and the login page for a logged-out visitor. Static hosting must rewrite application routes such as `/dashboard` and `/login` to `index.html` so direct browser refreshes continue to load the React app.

## Design approach

The interface uses:

- a slate/white/blue visual palette;
- compact rounded cards and controls;
- clear active/disabled status badges;
- desktop tables and mobile URL cards;
- native links for opening backend redirects;
- inline error and success banners instead of a notification library.

The frontend does not implement redirect logic, click tracking, caching, or rate limiting. Those remain backend responsibilities.

## Deployment

Build the application with:

```bash
npm run build
```

Deploy the generated `dist/` directory to a static hosting provider. Configure the production build variable:

```dotenv
VITE_API_BASE_URL=https://api.urlzs.xyz
```

The intended deployment is:

```text
https://urlzs.xyz      -> static React/Vite frontend
https://api.urlzs.xyz  -> Spring Boot backend on Render
```

Use HTTPS for both domains and configure backend CORS before testing browser requests in production.
