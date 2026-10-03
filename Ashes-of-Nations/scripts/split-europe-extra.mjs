import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const mapPath = path.join(root, "maps", "Европа.json");
const mapText = fs.readFileSync(mapPath, "utf8");
const map = JSON.parse(mapText);
const newline = mapText.includes("\r\n") ? "\r\n" : "\n";
const apply = process.argv.includes("--apply");
const provinces = [
  { id: 890, names: ["север", "юго-запад", "юго-восток"], seeds: [[880, 590], [879, 602], [893, 608]] },
  { id: 2229, names: ["запад", "центр", "восток"], seeds: [[842, 651], [852, 659], [863, 660]] },
];

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
  const steps = [[1, 0], [-1, 0], [0, 1], [0, -1]];
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

let nextId = Math.max(...map.regions.map((region) => region.id)) + 1;
const replacements = provinces.map((province) => {
  const original = map.regions.find((region) => region.id === province.id);
  if (!original || original.name.includes(" — ")) throw new Error(`Region ${province.id} is missing or already split`);
  const groups = organicGroups(original.pixels, province.seeds);
  const components = groups.map(connectedCount);
  console.log(`${original.name}: pixels ${groups.map((group) => group.length).join(", ")}; components ${components.join(", ")}`);
  if (process.argv.includes("--ascii")) {
    const minX = Math.min(...original.pixels.map((pixel) => pixel.x));
    const maxX = Math.max(...original.pixels.map((pixel) => pixel.x));
    const minY = Math.min(...original.pixels.map((pixel) => pixel.y));
    const maxY = Math.max(...original.pixels.map((pixel) => pixel.y));
    const rows = Array.from({ length: maxY - minY + 1 }, () => Array(maxX - minX + 1).fill(" "));
    groups.forEach((group, index) => group.forEach(({ x, y }) => { rows[y - minY][x - minX] = String(index); }));
    rows.forEach((row) => console.log(row.join("")));
  }
  if (groups.some((group) => group.length < 60) || components.some((count) => count !== 1)) {
    throw new Error(`${original.name}: sector is too small or disconnected`);
  }
  const pieces = groups.map((pixels, index) => ({
    ...original,
    id: index === 0 ? original.id : nextId++,
    name: `${original.name} — ${province.names[index]}`,
    pixels,
  }));
  return { original, pieces };
});

if (!apply) {
  console.log("Preview only; pass --apply to update the map and scenarios.");
  process.exit(0);
}

let updatedMapText = mapText;
for (const { original, pieces } of replacements) {
  const match = new RegExp(`^    \\{\\r?\\n      "id": ${original.id},`, "m").exec(updatedMapText);
  if (!match) throw new Error(`Could not locate region ${original.id}`);
  const end = updatedMapText.indexOf(`${newline}    }`, match.index);
  if (end < 0) throw new Error(`Could not locate end of region ${original.id}`);
  const replacement = pieces.map((piece) =>
    JSON.stringify(piece, null, 2).split("\n").map((line) => `    ${line}`).join(newline)
  ).join(`,${newline}`);
  updatedMapText = updatedMapText.slice(0, match.index) + replacement + updatedMapText.slice(end + newline.length + 5);
}
fs.writeFileSync(mapPath, updatedMapText);

for (const file of fs.readdirSync(path.join(root, "scenarios")).filter((name) => /^Европа \d{4}\.json$/.test(name))) {
  const scenarioPath = path.join(root, "scenarios", file);
  const scenario = JSON.parse(fs.readFileSync(scenarioPath, "utf8"));
  if (scenario.map?.file !== "Европа.json") continue;
  for (const { original, pieces } of replacements) {
    const country = scenario.countries.find((item) => item.regionIds?.includes(original.id));
    if (!country) throw new Error(`${file}: missing owner for ${original.id}`);
    country.regionIds.splice(country.regionIds.indexOf(original.id) + 1, 0, ...pieces.slice(1).map((piece) => piece.id));
    const divisions = scenario.administrativeDivisions;
    const index = divisions?.findIndex((item) => item.regionId === original.id) ?? -1;
    if (index >= 0) {
      const template = divisions[index];
      template.name = pieces[0].name.split(": ").at(-1);
      divisions.splice(index + 1, 0, ...pieces.slice(1).map((piece) => ({
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
entry.regions = map.regions.length + replacements.reduce((sum, { pieces }) => sum + pieces.length - 1, 0);
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(root, "data", "maps-catalog.js"), `window.MAPS_CATALOG = ${JSON.stringify(manifest.maps)};\n`);
console.log(`Europe map now has ${entry.regions} regions`);
