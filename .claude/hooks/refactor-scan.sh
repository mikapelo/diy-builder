#!/bin/bash
# ============================================================
# DIY Builder — Refactor Clean Scanner
# Détecte le dead code sans modifier les fichiers
# ============================================================

FRONTEND_DIR="/Users/pelo/Downloads/diy-builder-scraper3/frontend"
SCOPE="${1:-all}"

echo ""
echo "══════════════════════════════════════════"
echo "  🧹 REFACTOR SCAN — DIY Builder"
echo "  Scope : $SCOPE"
echo "══════════════════════════════════════════"
echo ""

cd "$FRONTEND_DIR" || exit 1

# ── 1. console.log résiduels ──
echo "📌 console.log résiduels :"
CONSOLE_FILES=$(grep -rn "console\.log" --include="*.js" --include="*.jsx" \
  --exclude-dir=node_modules --exclude-dir=.next \
  . 2>/dev/null | grep -v "//.*console\.log")
if [ -z "$CONSOLE_FILES" ]; then
  echo "   ✅ Aucun console.log trouvé"
else
  echo "$CONSOLE_FILES" | head -20
  COUNT=$(echo "$CONSOLE_FILES" | wc -l)
  echo "   → $COUNT occurrence(s)"
fi
echo ""

# ── 2. TODO / FIXME / HACK ──
echo "📌 TODO / FIXME / HACK :"
TODO_FILES=$(grep -rn "TODO\|FIXME\|HACK\|XXX" --include="*.js" --include="*.jsx" \
  --exclude-dir=node_modules --exclude-dir=.next \
  . 2>/dev/null)
if [ -z "$TODO_FILES" ]; then
  echo "   ✅ Aucun TODO résiduel"
else
  echo "$TODO_FILES" | head -15
  COUNT=$(echo "$TODO_FILES" | wc -l)
  echo "   → $COUNT occurrence(s)"
fi
echo ""

# ── 3. Fichiers JSX potentiellement orphelins ──
echo "📌 Composants potentiellement orphelins (JSX non importé ailleurs) :"
COMPONENTS_DIR="./components"
if [ -d "$COMPONENTS_DIR" ]; then
  while IFS= read -r file; do
    BASENAME=$(basename "$file" .jsx)
    BASENAME=$(basename "$BASENAME" .js)
    # Cherche si ce composant est importé quelque part
    IMPORTS=$(grep -rn "import.*$BASENAME" \
      --include="*.js" --include="*.jsx" \
      --exclude-dir=node_modules --exclude-dir=.next \
      . 2>/dev/null | grep -v "^$file")
    if [ -z "$IMPORTS" ]; then
      echo "   ⚠️  $file (aucun import détecté)"
    fi
  done < <(find "$COMPONENTS_DIR" -name "*.jsx" -o -name "*.js" 2>/dev/null)
else
  echo "   (dossier components/ absent)"
fi
echo ""

# ── 4. Fichiers volumineux (potentiel refactor) ──
echo "📌 Fichiers > 200 lignes (candidats au split) :"
find . -name "*.jsx" -o -name "*.js" | \
  grep -v node_modules | grep -v .next | \
  while read -r f; do
    LINES=$(wc -l < "$f" 2>/dev/null)
    if [ "$LINES" -gt 200 ]; then
      echo "   📄 $f ($LINES lignes)"
    fi
  done
echo ""

# ── 5. Imports potentiellement non utilisés ──
echo "📌 Variables importées possiblement non utilisées :"
echo "   (analyse statique légère — à confirmer manuellement)"
grep -rn "^import {" --include="*.jsx" --include="*.js" \
  --exclude-dir=node_modules --exclude-dir=.next \
  . 2>/dev/null | head -5
echo "   → Lance 'npx eslint . --rule no-unused-vars:error' pour l'analyse complète"
echo ""

echo "══════════════════════════════════════════"
echo "  Scan terminé — ne modifie aucun fichier"
echo "══════════════════════════════════════════"
echo ""
