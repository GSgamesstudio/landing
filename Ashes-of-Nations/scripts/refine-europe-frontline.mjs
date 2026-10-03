import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const mapPath = path.join(root, "maps", "Европа.json");
const mapText = fs.readFileSync(mapPath, "utf8");
const map = JSON.parse(mapText);
const newline = mapText.includes("\r\n") ? "\r\n" : "\n";
const apply = process.argv.includes("--apply");

// The points are sector centers inside the existing provinces. Weighted
// shortest-path growth produces irregular, connected boundaries.
const provinces = [
  { id: 894, seeds: [[941.22, 624.34], [954.58, 626.28], [943.03, 633.88], [954.36, 634.13], [945.10, 642.88], [954.46, 644.90]] },
  { id: 897, seeds: [[927.50, 637.07], [936.49, 636.92], [926.40, 647.35], [939.79, 647.64], [927.29, 657.96], [937.10, 656.60]] },
  { id: 893, seeds: [[905.70, 616.93], [924.95, 617.19], [907.44, 626.20], [924.73, 625.94], [909.06, 633.48], [920.79, 633.57]] },
  { id: 2227, seeds: [[898.80, 651.10], [909.15, 651.98], [895.29, 659.37], [913.32, 658.99], [896.79, 667.91], [912.10, 666.25]] },
];
const sectorNames = ["северо-запад", "северо-восток", "центр-запад", "центр-восток", "юго-запад", "юго-восток"];

// Natural Earth 1:10m rivers/lake centerlines, Dnipro (name_alt: Dnieper).
// Source: https://github.com/nvkelso/natural-earth-vector/tree/master/geojson
// The river runs east from the estuary; the first point extends the estuary to
// the western edge of this raster province. Coordinates are lon/lat.
const dnipro = [
  [31.30, 46.48], [32.646, 46.650], [32.795, 46.685], [33.000, 46.758],
  [33.200, 46.790], [33.397, 46.799], [33.540, 46.831], [33.653, 46.948],
  [33.800, 47.103], [33.965, 47.255], [34.007, 47.372], [34.004, 47.463],
  [34.157, 47.474], [34.319, 47.505], [34.584, 47.567], [34.832, 47.526],
  [35.165, 47.647],
].map(([lon, lat]) => ({ x: 477 + 12 * lon, y: 1346 - 14.5 * lat })).sort((a, b) => a.x - b.x);

function riverY(x) {
  if (x <= dnipro[0].x) return dnipro[0].y;
  for (let i = 1; i < dnipro.length; i += 1) {
    if (x <= dnipro[i].x) {
      const left = dnipro[i - 1];
      const right = dnipro[i];
      return left.y + (right.y - left.y) * (x - left.x) / (right.x - left.x);
    }
  }
  return dnipro.at(-1).y;
}

function organicGroups(pixels, seeds) {
  const byPosition = new Map(pixels.map((pixel) => [`${pixel.x},${pixel.y}`, pixel]));
  const distances = new Map();
  const labels = new Map();
  const queue = [];
  const push = (item) => {
    queue.push(item);
    let index = queue.length - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (queue[parent].distance <= queue[index].distance) break;
      [queue[parent], queue[index]] = [queue[index], queue[parent]];
      index = parent;
    }
  };
  const pop = () => {
    const first = queue[0];
    const last = queue.pop();
    if (queue.length) {
      queue[0] = last;
      let index = 0;
      while (true) {
        const left = index * 2 + 1;
        if (left >= queue.length) break;
        const right = left + 1;
        const child = right < queue.length && queue[right].distance < queue[left].distance ? right : left;
        if (queue[index].distance <= queue[child].distance) break;
        [queue[index], queue[child]] = [queue[child], queue[index]];
        index = child;
      }
    }
    return first;
  };
  seeds.forEach(([x, y], label) => {
    const seed = pixels.reduce((best, pixel) =>
      (pixel.x - x) ** 2 + (pixel.y - y) ** 2 < (best.x - x) ** 2 + (best.y - y) ** 2 ? pixel : best
    );
    const key = `${seed.x},${seed.y}`;
    distances.set(key, 0);
    labels.set(key, label);
    push({ pixel: seed, distance: 0, label });
  });
  const steps = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  while (queue.length) {
    const current = pop();
    const key = `${current.pixel.x},${current.pixel.y}`;
    if (current.distance !== distances.get(key) || current.label !== labels.get(key)) continue;
    for (const [dx, dy] of steps) {
      const { x, y } = current.pixel;
      const nextKey = `${x + dx},${y + dy}`;
      const next = byPosition.get(nextKey);
      if (!next) continue;
      const wave = 0.13 * Math.sin(next.x * 0.39 + next.y * 0.23 + current.label * 1.7)
        + 0.10 * Math.cos(next.y * 0.41 - next.x * 0.16 + current.label * 0.9);
      const distance = current.distance + Math.hypot(dx, dy) * (1 + wave);
      if (distance >= (distances.get(nextKey) ?? Infinity)) continue;
      distances.set(nextKey, distance);
      labels.set(nextKey, current.label);
      push({ pixel: next, distance, label: current.label });
    }
  }
  const groups = Array.from({ length: seeds.length }, () => []);
  for (const pixel of pixels) groups[labels.get(`${pixel.x},${pixel.y}`)].push(pixel);
  return groups;
}

function connectedCount(pixels) {
  const remaining = new Set(pixels.map(({ x, y }) => `${x},${y}`));
  let components = 0;
  while (remaining.size) {
    components += 1;
    const queue = [remaining.values().next().value];
    remaining.delete(queue[0]);
    for (let i = 0; i < queue.length; i += 1) {
      const [x, y] = queue[i].split(",").map(Number);
      for (const key of [`${x + 1},${y}`, `${x - 1},${y}`, `${x},${y + 1}`, `${x},${y - 1}`]) {
        if (remaining.delete(key)) queue.push(key);
      }
    }
  }
  return components;
}

const replacements = [];
for (const province of [...provinces, { id: 1610 }]) {
  const original = map.regions.find((region) => region.id === province.id);
  const prefix = original.name.split(" — ")[0];
  const oldPieces = map.regions.filter((region) => region.name.startsWith(`${prefix} — `));
  if (oldPieces.length !== 6) throw new Error(`${prefix}: expected six existing pieces`);
  const pixels = oldPieces.flatMap((piece) => piece.pixels);
  const groups = province.seeds ? organicGroups(pixels, province.seeds) : [[], []];
  if (!province.seeds) {
    for (const pixel of pixels) groups[pixel.y <= riverY(pixel.x) ? 0 : 1].push(pixel);
  }
  const components = groups.map(connectedCount);
  console.log(`${prefix}: pixels ${groups.map((group) => group.length).join(", ")}; components ${components.join(", ")}`);
  if (process.argv.includes("--ascii") || process.argv.includes(`--ascii=${province.id}`)) {
    const minX = Math.min(...pixels.map((pixel) => pixel.x));
    const maxX = Math.max(...pixels.map((pixel) => pixel.x));
    const minY = Math.min(...pixels.map((pixel) => pixel.y));
    const maxY = Math.max(...pixels.map((pixel) => pixel.y));
    const rows = Array.from({ length: maxY - minY + 1 }, () => Array(maxX - minX + 1).fill(" "));
    groups.forEach((group, index) => group.forEach(({ x, y }) => { rows[y - minY][x - minX] = String(index); }));
    rows.forEach((row) => console.log(row.join("")));
  }
  if (groups.some((group) => group.length < 35) || components.some((count) => count !== 1)) {
    throw new Error(`${prefix}: sector is too small or disconnected`);
  }
  const names = province.seeds ? sectorNames : ["правый берег Днепра", "левый берег Днепра"];
  const pieces = groups.map((group, index) => ({
    ...original,
    id: oldPieces[index].id,
    name: `${prefix} — ${names[index]}`,
    pixels: group,
  }));
  replacements.push({ original, oldPieces, pieces });
}

if (!apply) {
  console.log("Preview only; pass --apply to update the map and scenarios.");
  process.exit(0);
}

let updatedMapText = mapText;
for (const { original, oldPieces, pieces } of replacements) {
  const startMatch = new RegExp(`^    \\{\\r?\\n      "id": ${original.id},`, "m").exec(updatedMapText);
  const lastMatch = new RegExp(`^    \\{\\r?\\n      "id": ${oldPieces.at(-1).id},`, "m").exec(updatedMapText);
  if (!startMatch || !lastMatch || lastMatch.index <= startMatch.index) throw new Error(`Could not locate ${original.name} block`);
  const end = updatedMapText.indexOf(`${newline}    }`, lastMatch.index);
  if (end < 0) throw new Error(`Could not locate end of ${original.name} block`);
  const replacement = pieces.map((piece) =>
    JSON.stringify(piece, null, 2).split("\n").map((line) => `    ${line}`).join(newline)
  ).join(`,${newline}`);
  updatedMapText = updatedMapText.slice(0, startMatch.index) + replacement + updatedMapText.slice(end + newline.length + 5);
}
fs.writeFileSync(mapPath, updatedMapText);

for (const file of fs.readdirSync(path.join(root, "scenarios")).filter((name) => /^Европа \d{4}\.json$/.test(name))) {
  const scenarioPath = path.join(root, "scenarios", file);
  const scenario = JSON.parse(fs.readFileSync(scenarioPath, "utf8"));
  if (scenario.map?.file !== "Европа.json") continue;
  for (const { original, oldPieces, pieces } of replacements) {
    const oldIds = new Set(oldPieces.map((piece) => piece.id));
    const country = scenario.countries.find((item) => item.regionIds?.includes(original.id));
    if (!country) throw new Error(`${file}: missing owner for ${original.id}`);
    const index = country.regionIds.indexOf(original.id);
    country.regionIds = country.regionIds.filter((id) => !oldIds.has(id));
    country.regionIds.splice(index, 0, ...pieces.map((piece) => piece.id));
    const divisions = scenario.administrativeDivisions;
    const divisionIndex = divisions?.findIndex((item) => item.regionId === original.id) ?? -1;
    if (divisionIndex >= 0) {
      const template = divisions[divisionIndex];
      for (let i = divisions.length - 1; i >= 0; i -= 1) if (oldIds.has(divisions[i].regionId)) divisions.splice(i, 1);
      divisions.splice(divisionIndex, 0, ...pieces.map((piece) => ({
        ...template,
        regionId: piece.id,
        name: piece.name.split(": ").at(-1),
      })));
    }
  }
  fs.writeFileSync(scenarioPath, `${JSON.stringify(scenario, null, 2)}\n`);
}

const manifestPath = path.join(root, "maps", "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const entry = manifest.maps.find((item) => item.file === "Европа.json");
entry.regions = map.regions.length + replacements.reduce((sum, { oldPieces, pieces }) => sum + pieces.length - oldPieces.length, 0);
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(root, "data", "maps-catalog.js"), `window.MAPS_CATALOG = ${JSON.stringify(manifest.maps)};\n`);
console.log(`Europe map now has ${entry.regions} regions`);
