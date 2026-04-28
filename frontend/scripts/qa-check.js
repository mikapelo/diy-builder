const { execSync } = require("child_process");

const files = process.argv.slice(2).join(" ");

if (!files.trim()) {
  console.log("✅ Aucun fichier staged — QA skip");
  process.exit(0);
}

const isEngine = files.includes("engine.js");
const isScene = files.includes("CabanonScene.jsx");
const isViewer = files.includes("CabanonViewer.jsx");
const isSketch = files.includes("CabanonSketch.jsx");

console.log("🔍 QA check sur fichiers :", files);

// Cas critique
if (isEngine) {
  console.log("⚠️  Engine modifié → QA complet");
  execSync("npm run qa:full", { stdio: "inherit" });
  process.exit(0);
}

// Cas rendu 3D
if (isScene || isViewer) {
  console.log("🎮 Viewer modifié → QA quick + check visuel requis");
  execSync("npm run qa:quick", { stdio: "inherit" });

  console.log(`
👀 ACTION MANUELLE REQUISE :
  * Vérifier vue Assemblée
  * Vérifier vue Détaillée
  * Vérifier toiture
  * Vérifier modes
`);
  process.exit(0);
}

// Cas plan
if (isSketch) {
  console.log("📐 Plan modifié → QA quick + vérif SVG");
  execSync("npm run qa:quick", { stdio: "inherit" });

  console.log(`
👀 ACTION MANUELLE :
  * Vérifier cotations
  * Vérifier lisibilité
`);
  process.exit(0);
}

// Fallback
console.log("📦 QA standard");
execSync("npm run qa:quick", { stdio: "inherit" });
