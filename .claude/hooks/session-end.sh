#!/bin/bash
# ============================================================
# DIY Builder — SessionEnd hook
# Extrait les patterns clés de la session et les persiste.
# ============================================================

PROJECT_ROOT="/Users/pelo/Downloads/diy-builder-scraper3"
SESSION_LOG="$PROJECT_ROOT/.claude/session-history.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   🏁  DIY Builder — Fin de session       ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── Log de fin de session ──
echo "[$TIMESTAMP] session-end" >> "$SESSION_LOG"

# ── Rappel vérification si pas encore fait ──
CHECKPOINT_LOG="$PROJECT_ROOT/.claude/checkpoints.log"
if [ -f "$CHECKPOINT_LOG" ]; then
  TODAY=$(date '+%Y-%m-%d')
  TODAY_CHECKS=$(grep "$TODAY" "$CHECKPOINT_LOG" | wc -l)
  if [ "$TODAY_CHECKS" -eq 0 ]; then
    echo "⚠️  Aucun checkpoint aujourd'hui — pense à lancer /checkpoint avant de clore."
  else
    echo "✅ $TODAY_CHECKS checkpoint(s) enregistré(s) aujourd'hui"
  fi
fi

echo ""
echo "💾 Session fermée à $TIMESTAMP"
echo ""

exit 0
