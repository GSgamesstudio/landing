import fs from "node:fs";
import vm from "node:vm";

function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') { cell += '"'; index += 1; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) { cells.push(cell); cell = ""; }
    else cell += char;
  }
  cells.push(cell);
  return cells;
}

const tanks = fs.readFileSync("data.csv", "utf8").trim().split(/\r?\n/).map(parseCsvLine);
for (const cells of tanks) {
  if (cells.length !== 35 || !cells[34]?.trim() || /[А-ЯЁа-яё]/.test(cells[34])) {
    throw new Error(`Missing or invalid English name for ${cells[0] || "unnamed row"}`);
  }
}

const root = { nodeType: 1, querySelectorAll: () => [], hasAttribute: () => false };
class CanvasContext { fillText() {} strokeText() {} }
class Observer { observe() {} }
const context = {
  document: { documentElement: root, createTreeWalker: () => ({ nextNode: () => null }) },
  Node: { TEXT_NODE: 3, ELEMENT_NODE: 1 }, NodeFilter: { SHOW_TEXT: 4 },
  MutationObserver: Observer, CanvasRenderingContext2D: CanvasContext,
  window: {}, navigator: { language: "en" },
  tankRows: tanks.map((cells) => ({ name: cells[0], englishName: cells[34] }))
};
vm.runInNewContext(`${fs.readFileSync("js/00-i18n.js", "utf8")}
  activeGameLanguage = "en";
  registerTankEnglishNames(tankRows);
  globalThis.translate = localizeText;
  globalThis.render = translateGameDocument;
  globalThis.setLanguage = applyGameLanguage;`, context);

const translate = context.translate;
const examples = new Map([
  ["МС-1", "MS-1"],
  ["I уровень | ЛТ | СССР", "I tier | LT | USSR"],
  ["Прочность", "Hit points"],
  ["Урон", "Damage"],
  ["Пробитие", "Penetration"],
  ["Перезарядка 4.8 с", "Reload 4.8 s"],
  ["Броня", "Armour"],
  ["Боекомплект", "Ammunition loadout"],
  ["Роль: Разведка", "Role: Scout"],
  ["Сравнить", "Compare"],
  ["Тест-драйв", "Test drive"],
  ["Экипаж", "Crew"],
  ["Продажа недоступна", "Sale unavailable"],
  ["Скорость 163 ед/с", "Speed 163 units/s"]
]);
for (const [input, expected] of examples) {
  const actual = translate(input);
  if (actual !== expected) throw new Error(`${JSON.stringify(input)}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}
for (const cells of tanks) {
  if (translate(cells[0]) !== cells[34]) throw new Error(`Name lookup failed: ${cells[0]}`);
}

const label = { nodeType: 3, parentElement: { tagName: "DIV" }, nodeValue: "МС-1" };
const caption = { nodeType: 3, parentElement: { tagName: "DIV" }, nodeValue: "Сменить режим: Ротный бой" };
const attributes = new Map([["title", "Продажа недоступна"]]);
const button = {
  nodeType: 1, querySelectorAll: () => [],
  hasAttribute: (name) => attributes.has(name),
  getAttribute: (name) => attributes.get(name),
  setAttribute: (name, value) => attributes.set(name, value)
};
for (const [language, expectedName, expectedCaption, expectedTitle] of [
  ["ru", "МС-1", "Сменить режим: Ротный бой", "Продажа недоступна"],
  ["en", "MS-1", "Change mode: Company battle", "Sale unavailable"],
  ["ru", "МС-1", "Сменить режим: Ротный бой", "Продажа недоступна"],
  ["en", "MS-1", "Change mode: Company battle", "Sale unavailable"]
]) {
  context.gameSettings = { language };
  context.setLanguage();
  context.render(label);
  context.render(caption);
  context.render(button);
  if (label.nodeValue !== expectedName || caption.nodeValue !== expectedCaption || attributes.get("title") !== expectedTitle) {
    throw new Error(`Language switch to ${language} failed: ${label.nodeValue}, ${caption.nodeValue}, ${attributes.get("title")}`);
  }
}
caption.nodeValue = "Сравнить";
context.render(caption);
if (caption.nodeValue !== "Compare") throw new Error("Updated UI text was not translated");
context.gameSettings = { language: "ru" };
context.setLanguage();
context.render(caption);
if (caption.nodeValue !== "Сравнить") throw new Error("Updated UI text did not return to Russian");
context.gameSettings = { language: "en" };
context.setLanguage();
console.log(`Checked ${tanks.length} English names, ${examples.size} UI examples, and language switching.`);
if (process.argv.includes("--audit")) {
  const missing = new Set();
  for (const file of fs.readdirSync("js").filter((name) => /^0[0-8].*\.js$/.test(name))) {
    const source = fs.readFileSync(`js/${file}`, "utf8");
    for (const match of source.matchAll(/"(?:\\.|[^"\\])*"/g)) {
      try {
        const literal = JSON.parse(match[0]);
        if (/[А-ЯЁа-яё]/.test(literal) && /[А-ЯЁа-яё]/.test(translate(literal))) missing.add(literal);
      } catch { /* Ignore non-JSON JavaScript string literals. */ }
    }
    for (const match of source.matchAll(/`([^`]{1,160})`/g)) {
      const literal = match[1].replace(/\$\{[^}]*\}/g, "0");
      if (/[А-ЯЁа-яё]/.test(literal) && /[А-ЯЁа-яё]/.test(translate(literal))) missing.add(literal);
    }
  }
  console.log(`Russian literals remaining after translation: ${missing.size}`);
  console.log([...missing].filter((value) => value.length < 90).join("\n"));
}
