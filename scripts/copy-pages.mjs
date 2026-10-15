import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "dist", "public");
const destination = path.join(root, "docs");
if (!fs.existsSync(path.join(source, "index.html"))) {
  throw new Error("Static build is missing dist/public/index.html");
}
fs.rmSync(destination, { recursive: true, force: true });
fs.cpSync(source, destination, { recursive: true });
for (const internalPath of ["api", "__manus__", "manus-routes.json", ".gitkeep"]) {
  fs.rmSync(path.join(destination, internalPath), { recursive: true, force: true });
}
fs.writeFileSync(path.join(destination, ".nojekyll"), "", "utf8");
console.log("Copied the static website to docs/ for GitHub Pages.");
