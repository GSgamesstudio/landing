import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const mapPath = path.join(root, "maps", "Европа.json");
const mapText = fs.readFileSync(mapPath, "utf8");
const map = JSON.parse(mapText);
const newline = mapText.includes("\r\n") ? "\r\n" : "\n";
const sectors = [
  "северо-запад",
  "северо-восток",
  "центр-запад",
  "центр-восток",
  "юго-запад",
  "юго-восток",
];
const splits = [
  { id: 894, x: 949, y1: 630, y2: 640 },
  { id: 897, x: 934, y1: 642, y2: 653 },
  { id: 893, x: 916, y1: 622, y2: 631 },
  { id: 2227, x: 904, y1: 655, y2: 664 },
  { id: 1610, x: 877, y1: 665, y2: 674 },
];
let nextId = Math.max(...map.regions.map((region) => region.id)) + 1;
let updatedMapText = mapText;
const addedByParent = new Map();

for (const split of splits) {
  const parent = map.regions.find((region) => region.id === split.id);
  if (!parent) throw new Error(`Region ${split.id} is missing`);
  if (parent.name.includes(" — ")) continue;
  const groups = Array.from({ length: sectors.length }, () => []);
  for (const pixel of parent.pixels) {
    const row = pixel.y < split.y1 ? 0 : pixel.y < split.y2 ? 1 : 2;
    const column = pixel.x < split.x ? 0 : 1;
    groups[row * 2 + column].push(pixel);
  }
  if (groups.some((pixels) => pixels.length < 40)) throw new Error(`Region ${split.id} has a small sector`);
  const pieces = groups.map((pixels, index) => ({
    ...parent,
    id: index === 0 ? parent.id : nextId++,
    name: `${parent.name} — ${sectors[index]}`,
    pixels,
  }));
  addedByParent.set(parent.id, pieces);

  const marker = new RegExp(`^    \\{\\r?\\n      "id": ${parent.id},`, "m");
  const match = marker.exec(updatedMapText);
  if (!match) throw new Error(`Could not locate region ${parent.id} in map text`);
  const end = updatedMapText.indexOf(`${newline}    }`, match.index);
  if (end < 0) throw new Error(`Could not locate end of region ${parent.id}`);
  const replacement = pieces.map((piece) =>
    JSON.stringify(piece, null, 2).split("\n").map((line) => `    ${line}`).join(newline)
  ).join(`,${newline}`);
  updatedMapText = updatedMapText.slice(0, match.index) + replacement + updatedMapText.slice(end + newline.length + 5);
  console.log(`${parent.name}: ${parent.pixels.length} pixels -> ${groups.map((pixels) => pixels.length).join(", ")}`);
}

fs.writeFileSync(mapPath, updatedMapText);

for (const file of fs.readdirSync(path.join(root, "scenarios")).filter((name) => /^Европа \d{4}\.json$/.test(name))) {
  const scenarioPath = path.join(root, "scenarios", file);
  const source = fs.readFileSync(scenarioPath, "utf8");
  const scenario = JSON.parse(source);
  if (scenario.map?.file !== "Европа.json") continue;
  for (const [parentId, pieces] of addedByParent) {
    const country = scenario.countries.find((item) => item.regionIds?.includes(parentId));
    if (!country) throw new Error(`${file}: region ${parentId} has no owner`);
    country.regionIds.splice(country.regionIds.indexOf(parentId) + 1, 0, ...pieces.slice(1).map((piece) => piece.id));
    const divisions = scenario.administrativeDivisions;
    const index = divisions?.findIndex((item) => item.regionId === parentId) ?? -1;
    if (index >= 0) {
      const original = divisions[index];
      original.name = pieces[0].name.split(": ").at(-1);
      divisions.splice(index + 1, 0, ...pieces.slice(1).map((piece) => ({
        ...original,
        regionId: piece.id,
        name: piece.name.split(": ").at(-1),
      })));
    }
  }
  fs.writeFileSync(scenarioPath, `${JSON.stringify(scenario, null, 2)}\n`);
  console.log(`Updated ${file}`);
}

const manifestPath = path.join(root, "maps", "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const entry = manifest.maps.find((item) => item.file === "Европа.json");
entry.regions = map.regions.length + [...addedByParent.values()].reduce((sum, pieces) => sum + pieces.length - 1, 0);
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(root, "data", "maps-catalog.js"), `window.MAPS_CATALOG = ${JSON.stringify(manifest.maps)};\n`);
console.log(`Europe map now has ${entry.regions} regions`);
