#!/bin/bash
# ============================================================
# DIY Builder — Security Scan (léger)
# Adapté d'AgentShield / everything-claude-code
# ============================================================

PROJECT_ROOT="/Users/pelo/Downloads/diy-builder-scraper3"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo ""
echo "══════════════════════════════════════════"
echo "  🔐 SECURITY SCAN — DIY Builder"
echo "══════════════════════════════════════════"
echo ""

ISSUES=0

# ── 1. Secrets patterns ──
echo "📌 Recherche de secrets potentiels..."
SECRET_PATTERNS="(api[_-]?key|secret[_-]?key|password|passwd|token|bearer|private[_-]?key|aws[_-]?access)"
SECRETS=$(grep -rniE "$SECRET_PATTERNS\s*[:=]\s*['\"]?[A-Za-z0-9+/]{8,}" \
  --include="*.js" --include="*.jsx" --include="*.env*" \
  --exclude-dir=node_modules --exclude-dir=.next \
  "$PROJECT_ROOT" 2>/dev/null | grep -v "//.*" | grep -v "test\|mock\|example\|dummy\|placeholder")

if [ -z "$SECRETS" ]; then
  echo "   ✅ Aucun secret apparent détecté"
else
  echo "   ⚠️  Patterns suspects :"
  echo "$SECRETS" | head -10
  ISSUES=$((ISSUES+1))
fi
echo ""

# ── 2. Fichiers .env ──
echo "📌 Vérification fichiers .env..."
ENV_FILES=$(find "$PROJECT_ROOT" -name ".env*" -not -path "*/node_modules/*" 2>/dev/null)
if [ -z "$ENV_FILES" ]; then
  echo "   ✅ Aucun fichier .env trouvé"
else
  echo "   📄 Fichiers .env présents :"
  echo "$ENV_FILES"
  # Vérifier .gitignore
  if grep -q "\.env" "$PROJECT_ROOT/.gitignore" 2>/dev/null; then
    echo "   ✅ .env présent dans .gitignore"
  else
    echo "   ⚠️  .env NON dans .gitignore — risque d'exposition Git"
    ISSUES=$((ISSUES+1))
  fi
fi
echo ""

# ── 3. npm audit ──
echo "📌 npm audit (dépendances)..."
if [ -d "$FRONTEND_DIR" ]; then
  cd "$FRONTEND_DIR" || exit 1
  AUDIT_OUTPUT=$(npm audit --audit-level=high 2>&1)
  AUDIT_EXIT=$?
  if [ $AUDIT_EXIT -eq 0 ]; then
    echo "   ✅ Aucune vulnérabilité HIGH/CRITICAL"
  else
    echo "   ⚠️  Vulnérabilités détectées :"
    echo "$AUDIT_OUTPUT" | grep -E "(high|critical|moderate)" | head -10
    ISSUES=$((ISSUES+1))
  fi
fi
echo ""

# ── 4. Permissions MCP coordinator ──
echo "📌 Configuration MCP coordinator..."
MCP_CONFIG="$PROJECT_ROOT/.claude/settings.json"
if [ -f "$MCP_CONFIG" ]; then
  echo "   📄 $MCP_CONFIG existe"
  # Vérifier que le coordinator pointe sur un fichier local uniquement
  if grep -q '"command": "node"' "$MCP_CONFIG" 2>/dev/null; then
    echo "   ✅ MCP coordinator en mode local (node) — OK"
  fi
else
  echo "   ℹ️  Pas de settings.json trouvé"
fi
echo ""

# ── Résumé ──
echo "══════════════════════════════════════════"
if [ $ISSUES -eq 0 ]; then
  echo "  ✅ Scan terminé — 0 problème détecté"
else
  echo "  ⚠️  Scan terminé — $ISSUES problème(s) à investiguer"
fi
echo "══════════════════════════════════════════"
echo ""
