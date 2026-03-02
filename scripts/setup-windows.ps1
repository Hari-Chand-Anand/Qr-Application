# Windows setup helper (PowerShell)
# Usage:
#   cd <project>
#   powershell -ExecutionPolicy Bypass -File .\scripts\setup-windows.ps1

$ErrorActionPreference = "Stop"

# 1) Create .env from .env.example if missing
if (!(Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "Created .env from .env.example. Please edit .env with correct values."
} else {
  Write-Host ".env already exists. Skipping."
}

# 2) Install deps
npm install

# 3) Generate Prisma client
npx prisma generate

Write-Host "Done. Next steps:"
Write-Host "  - Ensure Postgres is running and DATABASE_URL in .env is correct"
Write-Host "  - Run: npx prisma migrate dev --name init"
Write-Host "  - Run: npm run dev"
