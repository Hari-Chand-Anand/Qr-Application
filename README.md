# QR-Based Machine Information System

A production-ready QR generator + machine landing page system.

## What it does
- Admin panel (password-protected) to **create / edit / delete** machines
- For every machine, the system generates a **unique QR code** that links to:
  - Specs/Catalog (Google Drive link)
  - Service & Installation Reports (Google Sheets link)
  - Request Quote (WhatsApp link with prefilled message)

## Tech stack
- **Next.js (App Router)** for web app + API routes
- **PostgreSQL** database
- **Prisma ORM** for schema/migrations
- **Tailwind CSS** for a clean mobile-first UI
- **QR generation** using `qrcode` (high-res PNG downloads)

---

## 1) Local setup

### Prerequisites
- Node.js 20.9+ recommended (Next.js requirement)
- A PostgreSQL database (local Docker is easiest)

### Start Postgres locally (Docker)
```bash
docker run --name qrpg -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=qrdb -p 5432:5432 -d postgres:16
```

### Install dependencies
```bash
npm install
```

### Configure environment
Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
```

Then edit `.env`:

```bash
DATABASE_URL="postgresql://postgres:pass@localhost:5432/qrdb?schema=public"

# Admin login (for /admin)
ADMIN_USER="admin"
ADMIN_PASS="change-this-now"

# Session signing secret (any long random string)
AUTH_SECRET="replace-with-long-random-secret"

# Public base URL used for generating QR codes
# Local:
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Optional branding
NEXT_PUBLIC_COMPANY_NAME="Your Company"
NEXT_PUBLIC_LOGO_URL=""   # e.g. https://.../logo.png

# Optional defaults (used if machine-specific values are empty)
NEXT_PUBLIC_DEFAULT_WA_NUMBER="919999999999"
NEXT_PUBLIC_DEFAULT_WA_TEMPLATE="Hi, I'd like to request a quote for [Machine Name] ([Machine ID])."
```

### Setup DB schema
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Seed a demo machine (optional)
```bash
npm run db:seed
```

### Run the app
```bash
npm run dev
```

Open:
- Admin: `http://localhost:3000/admin`
- Demo landing (after seeding): `http://localhost:3000/m/demo-001`

---

## 2) Deploy (Vercel recommended)

### Database (recommended)
Use a managed Postgres like **Supabase** or **Neon**.

1. Create a Postgres database.
2. Set `DATABASE_URL` in Vercel environment variables.
3. Also set: `ADMIN_USER`, `ADMIN_PASS`, `AUTH_SECRET`, `NEXT_PUBLIC_BASE_URL`.

### Deploy steps
1. Push this repo to GitHub.
2. Import into Vercel.
3. Add Environment Variables.
4. In Vercel, set Build Command (default is fine):
   - `npm run build`
5. Add a **Post-deploy** step to run migrations:
   - Option A (recommended): Use Prisma Migrate in CI (GitHub Actions)
   - Option B: Run `npx prisma migrate deploy` from your deployment pipeline

> Note: Vercel serverless environments are ephemeral; do not use local SQLite for production.

---

## 3) Usage

### Admin workflow
1. Go to `/admin` and login.
2. Click **Add Machine**.
3. Fill in:
   - Machine Name
   - Drive link (Specs/Catalog)
   - Sheets link (Reports)
   - WhatsApp number + template
4. Save → you’ll see:
   - Landing page URL
   - QR preview
   - Download buttons (1024px or 2048px PNG)

### WhatsApp template placeholders
- `[Machine Name]` → replaced with the machine name
- `[Machine ID]` → replaced with the machine’s machineId

---

## 4) Security notes
- This is a lightweight admin auth model using env-based username/password and signed cookies.
- For enterprise security: replace it with Google/Microsoft SSO (NextAuth) or Supabase Auth.

---

## License
MIT


## Quick setup scripts

- **Windows (PowerShell):** `powershell -ExecutionPolicy Bypass -File .\scripts\setup-windows.ps1`
- **Linux/macOS:** `bash ./scripts/setup-unix.sh`
