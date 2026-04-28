import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ── Persistence ──────────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "coordinator-db.json");

function loadDb() {
  if (existsSync(DB_PATH)) {
    try {
      return JSON.parse(readFileSync(DB_PATH, "utf-8"));
    } catch {
      return createEmptyDb();
    }
  }
  return createEmptyDb();
}

function createEmptyDb() {
  return { sessions: {}, messages: [], state: {}, tasks: [], contracts: {} };
}

function saveDb(db) {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

let db = loadDb();

// ── MCP Server ───────────────────────────────────────────────────────────────
const server = new McpServer({
  name: "coordinator",
  version: "1.0.0",
});

// ─── 1. Sessions ─────────────────────────────────────────────────────────────

server.tool(
  "register_session",
  "Enregistre cette session avec un nom et un rôle. À appeler en début de conversation.",
  {
    name: z.string().describe("Nom unique de la session (ex: 'design', 'simulator', 'pdf')"),
    focus: z.string().describe("Ce sur quoi cette session travaille"),
  },
  async ({ name, focus }) => {
    db.sessions[name] = {
      focus,
      registeredAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
    };
    saveDb(db);
    return { content: [{ type: "text", text: `Session "${name}" enregistrée. Focus : ${focus}` }] };
  }
);

server.tool(
  "list_sessions",
  "Liste toutes les sessions enregistrées et leur rôle.",
  {},
  async () => {
    const entries = Object.entries(db.sessions);
    if (entries.length === 0) {
      return { content: [{ type: "text", text: "Aucune session enregistrée." }] };
    }
    const lines = entries.map(
      ([name, s]) => `• ${name} — ${s.focus} (vu: ${s.lastSeen})`
    );
    return { content: [{ type: "text", text: lines.join("\n") }] };
  }
);

server.tool(
  "heartbeat",
  "Met à jour le lastSeen d'une session. Appeler périodiquement.",
  {
    name: z.string().describe("Nom de la session"),
  },
  async ({ name }) => {
    if (db.sessions[name]) {
      db.sessions[name].lastSeen = new Date().toISOString();
      saveDb(db);
    }
    return { content: [{ type: "text", text: `Heartbeat OK pour "${name}"` }] };
  }
);

// ─── 2. Messages inter-sessions ─────────────────────────────────────────────

server.tool(
  "send_message",
  "Envoie un message à une autre session. Elle le verra au prochain get_messages.",
  {
    from: z.string().describe("Nom de la session émettrice"),
    to: z.string().describe("Nom de la session destinataire, ou 'all' pour broadcast"),
    message: z.string().describe("Contenu du message"),
    priority: z.enum(["low", "normal", "high"]).default("normal").describe("Priorité"),
  },
  async ({ from, to, message, priority }) => {
    const msg = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      from,
      to,
      message,
      priority,
      timestamp: new Date().toISOString(),
      read: false,
    };
    db.messages.push(msg);
    saveDb(db);
    return {
      content: [{ type: "text", text: `Message #${msg.id} envoyé de "${from}" à "${to}" [${priority}]` }],
    };
  }
);

server.tool(
  "get_messages",
  "Récupère les messages non lus pour cette session.",
  {
    for: z.string().describe("Nom de la session qui récupère ses messages"),
    markAsRead: z.boolean().default(true).describe("Marquer comme lus après récupération"),
  },
  async ({ for: sessionName, markAsRead }) => {
    const mine = db.messages.filter(
      (m) => !m.read && (m.to === sessionName || m.to === "all")
    );
    if (mine.length === 0) {
      return { content: [{ type: "text", text: "Aucun nouveau message." }] };
    }
    if (markAsRead) {
      mine.forEach((m) => { m.read = true; });
      saveDb(db);
    }
    const lines = mine.map(
      (m) => `[${m.priority}] ${m.from} → ${m.to}: ${m.message} (${m.timestamp})`
    );
    return { content: [{ type: "text", text: lines.join("\n") }] };
  }
);

// ─── 3. État partagé ─────────────────────────────────────────────────────────

server.tool(
  "set_state",
  "Stocke une valeur partagée accessible par toutes les sessions.",
  {
    key: z.string().describe("Clé de l'état (ex: 'colorPalette', 'currentVersion')"),
    value: z.string().describe("Valeur (JSON stringifié si objet)"),
    setBy: z.string().describe("Session qui définit la valeur"),
  },
  async ({ key, value, setBy }) => {
    db.state[key] = {
      value,
      setBy,
      updatedAt: new Date().toISOString(),
    };
    saveDb(db);
    return { content: [{ type: "text", text: `État "${key}" mis à jour par ${setBy}` }] };
  }
);

server.tool(
  "get_state",
  "Lit une valeur de l'état partagé.",
  {
    key: z.string().describe("Clé à lire"),
  },
  async ({ key }) => {
    const entry = db.state[key];
    if (!entry) {
      return { content: [{ type: "text", text: `Aucun état trouvé pour "${key}"` }] };
    }
    return {
      content: [
        {
          type: "text",
          text: `${key} = ${entry.value}\n(par ${entry.setBy}, ${entry.updatedAt})`,
        },
      ],
    };
  }
);

server.tool(
  "list_state",
  "Liste toutes les clés de l'état partagé.",
  {},
  async () => {
    const keys = Object.keys(db.state);
    if (keys.length === 0) {
      return { content: [{ type: "text", text: "Aucun état partagé." }] };
    }
    const lines = keys.map(
      (k) => `• ${k} = ${db.state[k].value} (par ${db.state[k].setBy})`
    );
    return { content: [{ type: "text", text: lines.join("\n") }] };
  }
);

// ─── 4. Tâches coordonnées ──────────────────────────────────────────────────

server.tool(
  "create_task",
  "Crée une tâche assignée à une session.",
  {
    title: z.string().describe("Titre de la tâche"),
    assignTo: z.string().describe("Session responsable"),
    createdBy: z.string().describe("Session qui crée la tâche"),
    description: z.string().optional().describe("Détails supplémentaires"),
    priority: z.enum(["low", "normal", "high"]).default("normal"),
  },
  async ({ title, assignTo, createdBy, description, priority }) => {
    const task = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      title,
      description: description || "",
      assignTo,
      createdBy,
      priority,
      status: "pending",
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    db.tasks.push(task);
    saveDb(db);
    return {
      content: [{ type: "text", text: `Tâche #${task.id} créée: "${title}" → ${assignTo} [${priority}]` }],
    };
  }
);

server.tool(
  "list_tasks",
  "Liste les tâches, optionnellement filtrées par session ou statut.",
  {
    assignedTo: z.string().optional().describe("Filtrer par session assignée"),
    status: z.enum(["pending", "in_progress", "done", "all"]).default("all"),
  },
  async ({ assignedTo, status }) => {
    let filtered = db.tasks;
    if (assignedTo) {
      filtered = filtered.filter((t) => t.assignTo === assignedTo);
    }
    if (status !== "all") {
      filtered = filtered.filter((t) => t.status === status);
    }
    if (filtered.length === 0) {
      return { content: [{ type: "text", text: "Aucune tâche trouvée." }] };
    }
    const lines = filtered.map(
      (t) =>
        `[${t.status}] #${t.id} "${t.title}" → ${t.assignTo} (par ${t.createdBy}, ${t.priority})`
    );
    return { content: [{ type: "text", text: lines.join("\n") }] };
  }
);

server.tool(
  "update_task",
  "Met à jour le statut d'une tâche.",
  {
    id: z.string().describe("ID de la tâche"),
    status: z.enum(["pending", "in_progress", "done"]).describe("Nouveau statut"),
    note: z.string().optional().describe("Note optionnelle"),
  },
  async ({ id, status, note }) => {
    const task = db.tasks.find((t) => t.id === id);
    if (!task) {
      return { content: [{ type: "text", text: `Tâche #${id} introuvable.` }] };
    }
    task.status = status;
    if (status === "done") task.completedAt = new Date().toISOString();
    if (note) task.description += `\n[Note] ${note}`;
    saveDb(db);
    return {
      content: [{ type: "text", text: `Tâche #${id} → ${status}${note ? " (" + note + ")" : ""}` }],
    };
  }
);

// ─── 5. Contrats d'interface ────────────────────────────────────────────────

server.tool(
  "declare_contract",
  "Déclare un contrat d'interface entre modules (ex: format BOM, API shape).",
  {
    name: z.string().describe("Nom du contrat (ex: 'BOM_FORMAT', 'PDF_INPUT')"),
    schema: z.string().describe("Description ou JSON schema du contrat"),
    declaredBy: z.string().describe("Session qui déclare le contrat"),
  },
  async ({ name, schema, declaredBy }) => {
    db.contracts[name] = {
      schema,
      declaredBy,
      declaredAt: new Date().toISOString(),
    };
    saveDb(db);
    return {
      content: [{ type: "text", text: `Contrat "${name}" déclaré par ${declaredBy}` }],
    };
  }
);

server.tool(
  "get_contract",
  "Récupère un contrat d'interface par nom.",
  {
    name: z.string().describe("Nom du contrat"),
  },
  async ({ name }) => {
    const contract = db.contracts[name];
    if (!contract) {
      return { content: [{ type: "text", text: `Contrat "${name}" introuvable.` }] };
    }
    return {
      content: [
        {
          type: "text",
          text: `Contrat "${name}" (par ${contract.declaredBy}, ${contract.declaredAt}):\n${contract.schema}`,
        },
      ],
    };
  }
);

server.tool(
  "list_contracts",
  "Liste tous les contrats d'interface déclarés.",
  {},
  async () => {
    const entries = Object.entries(db.contracts);
    if (entries.length === 0) {
      return { content: [{ type: "text", text: "Aucun contrat déclaré." }] };
    }
    const lines = entries.map(
      ([name, c]) => `• ${name} — par ${c.declaredBy} (${c.declaredAt})`
    );
    return { content: [{ type: "text", text: lines.join("\n") }] };
  }
);

// ─── 6. Journal d'activité ──────────────────────────────────────────────────

server.tool(
  "log_activity",
  "Enregistre une action notable dans le journal partagé.",
  {
    session: z.string().describe("Session qui log"),
    action: z.string().describe("Description courte de l'action"),
    files: z.string().optional().describe("Fichiers impactés (séparés par virgule)"),
  },
  async ({ session, action, files }) => {
    if (!db.activityLog) db.activityLog = [];
    const entry = {
      session,
      action,
      files: files || "",
      timestamp: new Date().toISOString(),
    };
    db.activityLog.push(entry);
    // Garder les 100 dernières entrées
    if (db.activityLog.length > 100) {
      db.activityLog = db.activityLog.slice(-100);
    }
    saveDb(db);
    return {
      content: [{ type: "text", text: `Activité loguée: [${session}] ${action}` }],
    };
  }
);

server.tool(
  "get_activity",
  "Récupère les dernières activités du journal partagé.",
  {
    limit: z.number().default(10).describe("Nombre d'entrées à récupérer"),
    session: z.string().optional().describe("Filtrer par session"),
  },
  async ({ limit, session }) => {
    if (!db.activityLog || db.activityLog.length === 0) {
      return { content: [{ type: "text", text: "Aucune activité enregistrée." }] };
    }
    let entries = db.activityLog;
    if (session) entries = entries.filter((e) => e.session === session);
    entries = entries.slice(-limit);
    const lines = entries.map(
      (e) => `[${e.timestamp}] ${e.session}: ${e.action}${e.files ? " (" + e.files + ")" : ""}`
    );
    return { content: [{ type: "text", text: lines.join("\n") }] };
  }
);

// ─── Démarrage ──────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
