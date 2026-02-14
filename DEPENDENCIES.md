# Dependencies


### 1. Prerequisites

- **Node.js** (v18 or newer recommended) — [nodejs.org](https://nodejs.org)
- **npm** (comes with Node)

Check versions:

```bash
node -v   # e.g. v20.x.x
npm -v    # e.g. 10.x.x
```

### 2. Install all dependencies

From the **project root**:

```bash
# Root (optional; has shared Monaco)
npm install

# Frontend
cd frontend && npm install && cd ..

# Backend
cd backend && npm install && cd ..
```

### 3. Backend environment variables

The backend needs API keys in a `.env` file (never commit this file).

```bash
cd backend
cp .env.example .env
```

Then edit `backend/.env` and set:

| Variable | Required | Purpose |
|----------|----------|---------|
| `GEMINI_API_KEY` | Yes (for AI roast) | Google Gemini API key |
| `ELEVENLABS_API_KEY` | Yes (for voice) | ElevenLabs API key |
| `PORT` | No (default `3001`) | Port the backend runs on |

Get keys:

- **Gemini:** [Google AI Studio](https://aistudio.google.com/apikey)
- **ElevenLabs:** [ElevenLabs](https://elevenlabs.io) → Profile → API key

### 4. Run the app

You need **two terminals**: one for the backend, one for the frontend.

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

Backend will be at `http://localhost:3001` (or whatever `PORT` you set).

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

Frontend will be at `http://localhost:5173` (or the port Vite prints). Open that URL in the browser.

### Quick checklist

- [ ] Node.js and npm installed
- [ ] `npm install` run in **frontend** and **backend**
- [ ] `backend/.env` created from `.env.example` with real API keys
- [ ] Backend running (`npm run dev` in `backend`)
- [ ] Frontend running (`npm run dev` in `frontend`)

---

## Package dependency tables

---

## Root (`/package.json`)

| Package | Version | Purpose |
|---------|---------|---------|
| `@monaco-editor/react` | ^4.7.0 | React wrapper for Monaco code editor (shared with frontend) |

---

## Frontend (`/frontend/package.json`)

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@monaco-editor/react` | ^4.7.0 | Code editor component (Monaco/VS Code editor in the browser) |
| `axios` | ^1.13.5 | HTTP client for API requests |
| `framer-motion` | ^12.34.0 | Animations and transitions |
| `lucide-react` | ^0.564.0 | Icon set |
| `react` | ^19.2.0 | UI library |
| `react-dom` | ^19.2.0 | React DOM renderer |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@eslint/js` | ^9.39.1 | ESLint JavaScript config |
| `@tailwindcss/vite` | ^4.1.18 | Tailwind CSS v4 plugin for Vite |
| `@types/node` | ^24.10.1 | Node.js type definitions |
| `@types/react` | ^19.2.7 | React type definitions |
| `@types/react-dom` | ^19.2.3 | React DOM type definitions |
| `@vitejs/plugin-react-swc` | ^4.2.2 | Vite plugin for React + SWC |
| `eslint` | ^9.39.1 | Linter |
| `eslint-plugin-react-hooks` | ^7.0.1 | ESLint rules for React Hooks |
| `eslint-plugin-react-refresh` | ^0.4.24 | ESLint React Refresh support |
| `globals` | ^16.5.0 | Global variable config for ESLint |
| `tailwindcss` | ^4.1.18 | Utility-first CSS framework |
| `typescript` | ~5.9.3 | TypeScript compiler |
| `typescript-eslint` | ^8.48.0 | TypeScript support for ESLint |
| `vite` | ^7.3.1 | Build tool and dev server |

---

## Backend (`/backend/package.json`)

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@google/generative-ai` | ^0.24.1 | Google Gemini API client |
| `cors` | ^2.8.6 | CORS middleware for Express |
| `dotenv` | ^17.3.1 | Load environment variables from `.env` |
| `elevenlabs` | ^1.59.0 | ElevenLabs text-to-speech API |
| `express` | ^5.2.1 | Web server framework |
| `multer` | ^2.0.2 | File upload handling |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `nodemon` | ^3.1.11 | Restart server on file changes during development |

---

## Installing dependencies

From the project root:

```bash
# Root
npm install

# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
```

Or install everything (if using a workspace or from root):

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

---

*Last updated from `package.json` files in the repo.*
