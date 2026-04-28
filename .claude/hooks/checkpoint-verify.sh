#!/bin/bash
# ============================================================
# DIY Builder — Checkpoint + Verify pipeline
# Usage : appelé par /checkpoint ou /verify
# Lance : npm test (Vitest) + npm run build (Next.js)
# Log   : .claude/checkpoints.log
# ============================================================

FRONTEND_DIR="/Users/pelo/Downloads/diy-builder-scraper3/frontend"
LOG_FILE="/Users/pelo/Downloads/diy-builder-scraper3/.claude/checkpoints.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
LABEL="${1:-manual}"

cd "$FRONTEND_DIR" || { echo "❌ frontend/ introuvable"; exit 1; }

echo ""
echo "══════════════════════════════════════════"
echo "  🔍 CHECKPOINT DIY Builder — $TIMESTAMP"
echo "  Label : $LABEL"
echo "══════════════════════════════════════════"
echo ""

# ── Tests Vitest ──
echo "▶ npm test --run..."
TEST_OUTPUT=$(npm test -- --run 2>&1)
TEST_EXIT=$?

if [ $TEST_EXIT -eq 0 ]; then
  TEST_STATUS="✅ PASS"
  echo "$TEST_OUTPUT" | tail -5
else
  TEST_STATUS="❌ FAIL"
  echo "$TEST_OUTPUT" | tail -20
fi

echo ""

# ── Build Next.js ──
echo "▶ npm run build..."
BUILD_OUTPUT=$(npm run build 2>&1)
BUILD_EXIT=$?

if [ $BUILD_EXIT -eq 0 ]; then
  BUILD_STATUS="✅ PASS"
  echo "$BUILD_OUTPUT" | grep -E "(Route|chunk|First Load|compiled)" | tail -10
else
  BUILD_STATUS="❌ FAIL"
  echo "$BUILD_OUTPUT" | tail -20
fi

echo ""
echo "══════════════════════════════════════════"
echo "  Tests : $TEST_STATUS"
echo "  Build : $BUILD_STATUS"
echo "══════════════════════════════════════════"
echo ""

# ── Log ──
echo "[$TIMESTAMP] label=$LABEL tests=$TEST_STATUS build=$BUILD_STATUS" >> "$LOG_FILE"

# Exit code global
[ $TEST_EXIT -eq 0 ] && [ $BUILD_EXIT -eq 0 ] && exit 0 || exit 1
