#!/bin/bash
set -e

# checking script directory
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

echo "--- Starte Build-Prozess im Verzeichnis: $SCRIPT_DIR ---"

# building frontend
echo "building frontend..."
cd "$SCRIPT_DIR/frontend"

npx ng build --configuration production

echo "frontend build finished"

# building backend
echo "################################"
echo "starting backend..."
cd "$SCRIPT_DIR/backend"


poetry run python src/time_tino_backend/main.py