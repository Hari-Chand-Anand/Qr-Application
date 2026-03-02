#!/usr/bin/env bash
set -euo pipefail

# Linux/macOS setup helper
# Usage:
#   cd <project>
#   bash ./scripts/setup-unix.sh

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "Created .env from .env.example. Please edit .env with correct values."
else
  echo ".env already exists. Skipping."
fi

npm install
npx prisma generate

echo "Done. Next steps:"
echo "  - Ensure Postgres is running and DATABASE_URL in .env is correct"
echo "  - Run: npx prisma migrate dev --name init"
echo "  - Run: npm run dev"
