#!/usr/bin/env bash
# Post-merge setup: install dependencies and apply DB schema changes.
# Runs automatically after a task merges into main.
set -euo pipefail

echo "[post-merge] Installing npm dependencies..."
npm install --no-audit --no-fund --prefer-offline

if [ -n "${DATABASE_URL:-}" ]; then
  echo "[post-merge] Pushing Drizzle schema..."
  npm run db:push -- --force || npm run db:push
else
  echo "[post-merge] DATABASE_URL not set, skipping db:push."
fi

echo "[post-merge] Done."
