#!/usr/bin/env bash
# 在正确目录启动 Robotaxi Demo（请勿在 Documents 根目录运行 npm）
cd "$(dirname "$0")"

PORT=3456
URL="http://localhost:${PORT}/robotaxi-rain-mode-demo.html"

echo "============================================"
echo " Robotaxi Rain Mode — 静态 Figma Demo"
echo "============================================"
echo ""
echo "  浏览器打开: ${URL}"
echo ""
echo "  作品集页面 (需 Next.js): http://localhost:3000/work/robotaxi-rain-mode"
echo "  先另开终端执行: cd $(pwd) && npm run dev"
echo ""
echo "  按 Ctrl+C 停止"
echo "============================================"
echo ""

exec python3 -m http.server "$PORT" --directory public
