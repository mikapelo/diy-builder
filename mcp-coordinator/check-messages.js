#!/usr/bin/env node
/**
 * Script appelé par le hook Claude Code.
 * Lit les messages non lus pour la session courante dans coordinator-db.json.
 * Si des messages existent, les affiche sur stdout pour que Claude les voie.
 *
 * Usage: node check-messages.js <session-name>
 * La session est passée via la variable d'env COORDINATOR_SESSION
 * ou en argument.
 */
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "coordinator-db.json");
const sessionName = process.env.COORDINATOR_SESSION || process.argv[2];

if (!sessionName) {
  // Pas de session configurée — silencieux
  process.exit(0);
}

if (!existsSync(DB_PATH)) {
  process.exit(0);
}

try {
  const db = JSON.parse(readFileSync(DB_PATH, "utf-8"));
  const unread = (db.messages || []).filter(
    (m) => !m.read && (m.to === sessionName || m.to === "all")
  );

  if (unread.length === 0) {
    process.exit(0);
  }

  // Afficher les messages pour que Claude les voie via le hook
  console.log(`\n📨 [Coordinator] ${unread.length} message(s) pour "${sessionName}":`);
  for (const m of unread) {
    const prio = m.priority === "high" ? "🔴" : m.priority === "low" ? "⚪" : "🟡";
    console.log(`  ${prio} [${m.from}]: ${m.message}`);
  }
  console.log(`→ Utilise get_messages({for: "${sessionName}"}) pour marquer comme lus.\n`);
} catch {
  // Silencieux en cas d'erreur
  process.exit(0);
}
