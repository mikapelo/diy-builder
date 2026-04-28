#!/bin/bash
# ============================================================
# DIY Builder — SessionStart hook
# Charge le contexte du projet au démarrage d'une session.
# ============================================================

PROJECT_ROOT="/Users/pelo/Downloads/diy-builder-scraper3"
MEMORY_FILE="$PROJECT_ROOT/.auto-memory/MEMORY.md"
CHECKPOINT_LOG="$PROJECT_ROOT/.claude/checkpoints.log"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   🏗️  DIY Builder — Session démarrée     ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── Rappel fichiers protégés ──
echo "📛 Fichiers INTOUCHABLES :"
echo "   • lib/deckEngine.js"
echo "   • lib/deckConstants.js"
echo "   • lib/deckGeometry.js"
echo "   • lib/foundation/foundationCalculator.js"
echo ""

# ── Statut dernier checkpoint ──
if [ -f "$CHECKPOINT_LOG" ]; then
  LAST=$(tail -1 "$CHECKPOINT_LOG")
  echo "📊 Dernier checkpoint : $LAST"
else
  echo "📊 Aucun checkpoint enregistré"
fi
echo ""

# ── Mémoire disponible ──
if [ -f "$MEMORY_FILE" ]; then
  LINE_COUNT=$(wc -l < "$MEMORY_FILE")
  echo "📚 Mémoire projet : $LINE_COUNT lignes dans MEMORY.md"
else
  echo "📚 Pas de mémoire projet (MEMORY.md absent)"
fi
echo ""

# ── Messages coordinator ──
echo "📬 Vérification messages coordinator..."
node "$PROJECT_ROOT/mcp-coordinator/check-messages.js" lead 2>/dev/null || echo "   (coordinator non disponible)"
echo ""

exit 0
