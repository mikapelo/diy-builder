#!/bin/bash
# ============================================================
# DIY Builder — Guard: Fichiers protégés
# Trigger : PreToolUse (Write, Edit, MultiEdit)
# Bloque toute tentative de modification des fichiers intouchables.
# ============================================================

TOOL_INPUT=$(cat)

FILE_PATH=$(echo "$TOOL_INPUT" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    tool_input = data.get('tool_input', {})
    print(tool_input.get('file_path', ''))
except:
    print('')
" 2>/dev/null)

PROTECTED_FILES=(
  "lib/deckEngine.js"
  "lib/deckConstants.js"
  "lib/deckGeometry.js"
  "lib/foundation/foundationCalculator.js"
)

for PROTECTED in "${PROTECTED_FILES[@]}"; do
  if [[ "$FILE_PATH" == *"$PROTECTED"* ]]; then
    cat >&2 <<EOF
🛑 FICHIER PROTÉGÉ — Modification bloquée

  Fichier : $FILE_PATH
  Règle   : $PROTECTED est dans la liste des fichiers intouchables (cf. CLAUDE.md)

  ➜ Pour les calculs matériaux terrasse : passe par costCalculator.js
  ➜ Pour la géométrie cabanon : passe par modules/cabanon/engine.js
  ➜ Pour les fondations : les specs sont en lecture seule — documente un override dans le module concerné

EOF
    exit 2
  fi
done

exit 0
