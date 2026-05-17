#!/usr/bin/env bash
# Robotaxi Rain Mode — start dev server or static Figma demo fallback.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "Stopping existing Next.js processes..."
pkill -f "next dev" 2>/dev/null || true
sleep 1

if [[ "${1:-}" == "static" ]]; then
  echo ""
  echo "Static Figma demo (no Next.js):"
  echo "  http://localhost:3456/robotaxi-rain-mode-demo.html"
  echo ""
  exec npm run demo:robotaxi
fi

echo "Clearing .next cache..."
rm -rf .next

echo ""
echo "Starting Next.js with Webpack (Turbopack is disabled — it crashes on this project)."
echo "  http://localhost:3000/work/robotaxi-rain-mode"
echo ""
echo "If the page never loads after 3+ minutes, use the static demo instead:"
echo "  ./scripts/dev-robotaxi.sh static"
echo "  (or: npm run demo:robotaxi)"
echo ""
exec npm run dev
