# Dhairya Tiwari Portfolio

Two folders only — no shared root app:

```
client/   → React + Vite frontend (Render Static Site)
server/   → Express API (Render Web Service)
```

## What are `node_modules` and `dist`?

These are **not** part of your source code. npm creates them when you install or build:

| Folder | Created by | Purpose |
|--------|------------|---------|
| `node_modules/` | `npm install` | Downloaded packages (large, gitignored) |
| `dist/` | `npm run build` | Production build output (gitignored) |

Your real project images live in **`client/src/assets/`** (inside the frontend). That is not the same as an old root `assets/` folder.

To remove generated folders: `npm run clean` inside `client/` or `server/`.

## Local development

**Terminal 1 — API**

```bash
cd server
npm install
cp .env.example .env   # add GEMINI_API_KEY
npm run dev
```

**Terminal 2 — Frontend**

```bash
cd client
npm install
cp .env.example .env   # optional EmailJS keys
npm run dev
```

- Frontend: http://localhost:5173  
- API: http://localhost:3001  

## Deploy on Render

### Backend (`server/`)

| Setting | Value |
|---------|--------|
| Root Directory | `server` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |

Env: `GEMINI_API_KEY`, `FRONTEND_URL` = `https://portfolio-client-gcwe.onrender.com` (your exact static site URL, with `https://`, no trailing slash)

Optional: set **`NODE_VERSION`** = `22` in Render (avoids Node 24 + esbuild issues). The repo includes `server/.node-version`.

Do **not** set `NODE_ENV=production` during build if install skips packages (esbuild is in `dependencies`, so normal install is fine).

### Frontend (`client/`)

| Setting | Value |
|---------|--------|
| Root Directory | `client` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

Env: `VITE_API_URL` (your API URL), EmailJS `VITE_*` keys

Deploy API first, then set `VITE_API_URL` and redeploy the frontend.
