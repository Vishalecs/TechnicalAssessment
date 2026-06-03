# Complete Free Deployment Guide (Beginner Friendly)

Deploy your Inventory Management System **100% free** using:

| Part | Free Service | Why |
|------|--------------|-----|
| Database | **Neon** | Free PostgreSQL, easy setup |
| Backend API | **Render** | Free Node.js hosting |
| Frontend UI | **Vercel** | Free React/Vite hosting |

**Total cost: $0**

---

## What You Need Before Starting

1. A **GitHub account** (free) → https://github.com/signup  
2. Your project folder: `c:\Users\ASUS\Desktop\am`  
3. About **30–45 minutes**  
4. Internet connection  

---

# PART 1 — Put Your Code on GitHub

Hosting sites deploy from GitHub. Do this first.

### Step 1.1 — Create a GitHub repository

1. Go to https://github.com/new  
2. **Repository name:** `inventory-management-system`  
3. Choose **Public**  
4. Do **NOT** check "Add a README" (you already have code)  
5. Click **Create repository**  

### Step 1.2 — Push your code from your PC

Open **PowerShell** and run these commands **one by one**:

```powershell
cd c:\Users\ASUS\Desktop\am

git init
git add .
git commit -m "Initial commit - inventory management system"

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/inventory-management-system.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your real GitHub username.

**If Git asks you to login:**
- GitHub no longer accepts password in terminal
- Use **GitHub Desktop** (easier): https://desktop.github.com  
  - File → Add Local Repository → select `c:\Users\ASUS\Desktop\am`  
  - Publish repository  

**Important:** Before pushing, make sure `.env` is NOT uploaded (it is in `.gitignore` — good).

---

# PART 2 — Create Free Database (Neon)

### Step 2.1 — Sign up

1. Go to https://neon.tech  
2. Click **Sign Up** (use GitHub login — easiest)  

### Step 2.2 — Create project

1. Click **New Project**  
2. **Project name:** `inventory-db`  
3. **Region:** pick closest to you (e.g. US East, EU)  
4. Click **Create Project**  

### Step 2.3 — Copy database connection string

1. On the project dashboard, find **Connection string**  
2. Select **URI** tab  
3. Copy the string. It looks like:

```
postgresql://username:password@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

4. **Save this in Notepad** — you need it for Render backend  

This is your `DATABASE_URL`.

### Step 2.4 — (Optional) Seed data after backend is live

You will run the seed command later from Render shell (Part 3, Step 3.8).

---

# PART 3 — Deploy Backend on Render (Free)

### Step 3.1 — Sign up on Render

1. Go to https://render.com  
2. Click **Get Started** → sign up with **GitHub**  

### Step 3.2 — Create Web Service

1. Click **New +** → **Web Service**  
2. Connect your GitHub account if asked  
3. Find repository: `inventory-management-system`  
4. Click **Connect**  

### Step 3.3 — Configure backend settings

Fill in exactly:

| Field | Value |
|-------|-------|
| **Name** | `inventory-backend` |
| **Region** | Same as Neon (or closest) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | **Free** |

### Step 3.4 — Add Environment Variables

Scroll to **Environment Variables** → click **Add Environment Variable** for each:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Paste your Neon connection string from Part 2 |
| `CORS_ORIGIN` | Leave empty for now — add after Vercel deploy (Part 4) |
| `RATE_LIMIT_MAX` | `100` |

**Do NOT add** `DB_HOST`, `DB_USER`, etc. when using `DATABASE_URL` — Neon URL is enough.

### Step 3.5 — Deploy

1. Click **Create Web Service**  
2. Wait 5–10 minutes for first deploy (status: **Building** → **Live**)  
3. When live, copy your backend URL at the top, e.g.:

```
https://inventory-backend-xxxx.onrender.com
```

4. **Test in browser:** open:

```
https://inventory-backend-xxxx.onrender.com/api/health
```

You should see:

```json
{"success":true,"message":"API is running"}
```

### Step 3.6 — Note about free tier

Render free backend **sleeps after 15 minutes** of no traffic. First request after sleep may take **30–60 seconds** — this is normal on free plan.

### Step 3.7 — Update CORS (after you have frontend URL)

You will come back here after Part 4 and set:

```
CORS_ORIGIN=https://your-app.vercel.app
```

Then click **Manual Deploy** → **Deploy latest commit**.

### Step 3.8 — Seed sample data on live server

1. In Render dashboard → your backend service  
2. Click **Shell** tab (right side)  
3. Run:

```bash
node src/database/seed.js
```

4. You should see: `Seed completed successfully!`

---

# PART 4 — Deploy Frontend on Vercel (Free)

### Step 4.1 — Sign up

1. Go to https://vercel.com  
2. Click **Sign Up** → use **GitHub**  

### Step 4.2 — Import project

1. Click **Add New…** → **Project**  
2. Find `inventory-management-system` → click **Import**  

### Step 4.3 — Configure frontend

| Field | Value |
|-------|-------|
| **Framework Preset** | Vite (auto-detected) |
| **Root Directory** | Click **Edit** → set to `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### Step 4.4 — Environment variable (IMPORTANT)

Expand **Environment Variables**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://inventory-backend-xxxx.onrender.com/api` |

Replace `inventory-backend-xxxx` with **your real Render backend URL** from Part 3.

Example:

```
VITE_API_URL=https://inventory-backend-abc123.onrender.com/api
```

Must end with `/api` — not optional.

### Step 4.5 — Deploy

1. Click **Deploy**  
2. Wait 2–5 minutes  
3. Vercel gives you a URL like:

```
https://inventory-management-system.vercel.app
```

4. Open that URL in browser — your app should load.

### Step 4.6 — Connect backend CORS to frontend

Go back to **Render** → backend → **Environment Variables**:

Update `CORS_ORIGIN` to your Vercel URL (no trailing slash):

```
CORS_ORIGIN=https://inventory-management-system.vercel.app
```

Click **Save Changes** → Render will redeploy automatically.

### Step 4.7 — Redeploy frontend if you changed API URL

If you fixed `VITE_API_URL` after first deploy:

1. Vercel → your project → **Deployments**  
2. Click **⋯** on latest → **Redeploy**  

---

# PART 5 — Verify Everything Works

### Checklist

| # | Test | Expected |
|---|------|----------|
| 1 | Open `https://YOUR-BACKEND.onrender.com/api/health` | `API is running` |
| 2 | Open `https://YOUR-BACKEND.onrender.com/api/dashboard` | JSON with totals |
| 3 | Open `https://YOUR-APP.vercel.app` | Dashboard loads |
| 4 | Browser DevTools → **Network** tab | Requests go to `onrender.com/api` |
| 5 | Products page shows items | Data from database |

### If frontend shows empty or errors

1. **CORS wrong** → `CORS_ORIGIN` on Render must match Vercel URL exactly  
2. **Wrong API URL** → `VITE_API_URL` must be `https://....onrender.com/api`  
3. **Backend sleeping** → wait 60 seconds, refresh  
4. **No data** → run seed in Render Shell (Part 3.8)  

---

# PART 6 — URLs to Save

Write these down:

```
Frontend (share this):  https://________________.vercel.app
Backend API:            https://________________.onrender.com/api
Database:               Neon dashboard (no public URL)
GitHub repo:            https://github.com/YOUR_USERNAME/inventory-management-system
```

---

# Updating Your Live App Later

When you change code on your PC:

```powershell
cd c:\Users\ASUS\Desktop\am
git add .
git commit -m "Describe your change"
git push
```

- **Render** auto-redeploys backend  
- **Vercel** auto-redeploys frontend  

No extra steps needed.

---

# Alternative: All on Render (Backend + DB + Frontend)

If you prefer one platform only:

1. **Render PostgreSQL** — New → PostgreSQL (free 90 days)  
2. **Render Web Service** — backend (same as Part 3)  
3. **Render Static Site** — New → Static Site, root `frontend`, build `npm install && npm run build`, publish `dist`  
4. Set `VITE_API_URL` in static site env to your Render backend URL  

Use `render.yaml` in project root for blueprint deploy.

---

# Alternative: Railway (Backend + DB)

1. https://railway.app → New Project → Deploy from GitHub  
2. Add **PostgreSQL** plugin → copy `DATABASE_URL`  
3. Deploy backend service, root: `backend`, start: `node server.js`  
4. Set env: `NODE_ENV`, `DATABASE_URL`, `CORS_ORIGIN`  
5. Frontend still best on **Vercel** with `VITE_API_URL` pointing to Railway URL  

---

# Environment Variables Quick Reference

### Backend (Render / Railway)

| Variable | Example |
|----------|---------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `postgresql://...@neon.tech/neondb?sslmode=require` |
| `CORS_ORIGIN` | `https://myapp.vercel.app` |
| `PORT` | Auto-set by Render (do not override) |

### Frontend (Vercel)

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://my-backend.onrender.com/api` |

---

# Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `CORS blocked` | Match `CORS_ORIGIN` to exact Vercel URL |
| `Network Error` on frontend | Check `VITE_API_URL`, redeploy Vercel |
| `502` / timeout on API | Render waking up — wait and retry |
| `Database connection failed` | Check `DATABASE_URL`, Neon project active |
| Blank dashboard | Run `node src/database/seed.js` in Render Shell |
| Routes 404 on refresh (Vercel) | `vercel.json` already included in project |

---

# Summary Flow

```
Your PC (code)
    ↓ git push
GitHub
    ↓
├── Neon      → PostgreSQL database
├── Render    → Node.js API (reads DB)
└── Vercel    → React UI (calls Render API)
```

**Yes — live data always comes from your backend → Neon database**, same as locally.

---

Need help? Share your Render backend URL, Vercel URL, and a screenshot of any error message.
