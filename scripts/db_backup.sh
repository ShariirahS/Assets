#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

BACKUP_DIR="backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP="$(date +%F-%H%M%S)"
FILENAME="${BACKUP_DIR}/backup_${TIMESTAMP}.sql"

echo "Creating backup at $FILENAME"
echo "pg_dump \"$DATABASE_URL\" > \"$FILENAME\""
# pg_dump "$DATABASE_URL" > "$FILENAME"

echo "Backup script placeholder complete"
