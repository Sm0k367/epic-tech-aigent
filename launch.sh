#!/bin/bash
# launch-epic-aigent.sh
# One-command launcher for the full EPIC TECH AIGENT platform

echo "🚀 Launching EPIC TECH AIGENT..."

# Start API Core in background
echo "→ Starting API Core (self-mutating backend)..."
cd /workspace/epic-tech-aigent/apps/api-core
nohup node index.js > /tmp/api-core.log 2>&1 &
API_PID=$!
echo "   API Core running on http://localhost:4000 (PID: $API_PID)"

# Start Web UI
echo "→ Starting Web UI (Next.js)..."
cd /workspace/epic-tech-aigent/apps/web-ui
PORT=45873
nohup npm run dev -- -p $PORT > /tmp/web-ui.log 2>&1 &
WEB_PID=$!
echo "   Web UI running on http://localhost:$PORT (PID: $WEB_PID)"

echo ""
echo "✅ EPIC TECH AIGENT is live!"
echo ""
echo "Main surface:     http://localhost:45873"
echo "API endpoints:    http://localhost:4000/state"
echo ""
echo "To stop everything:"
echo "  kill $API_PID $WEB_PID"
echo ""
echo "Open http://localhost:45873 in your browser to begin interacting with the living mesh."
