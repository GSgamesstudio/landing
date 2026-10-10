import fs from "node:fs";

const path = "data.csv";
const source = fs.readFileSync(path, "utf8");
const overrides = new Map(Object.entries({
  "МС-1": "MS-1", "объект 263": "Object 263", "объект 261": "Object 261",
  "объект 268": "Object 268", "объект 704": "Object 704", "объект 416": "Object 416",
  "объект 430": "Object 430", "объект 430Б": "Object 430B",
  "Т-34 блокадный": "T-34 Blockade", "Т-80 Ранний": "T-80 Early",
  "Объект 490 Бунтарь": "Object 490 Rebel", "Объект 277Б Тайфун": "Object 277B Typhoon",
  "БТР-90 Росток": "BTR-90 Rostok", "К-17 Бумеранг": "K-17 Boomerang",
  "БМ-13 Катюша": "BM-13 Katyusha", "2С7 Пион": "2S7 Pion", "2С7 Малка": "2S7 Malka",
  "Руссо-Балт тип C": "Russo-Balt Type C", "ПОРОГ": "POROG",
  "Т-1 петрушка": "T-1 Petrushka", "Т-31 смирный": "T-31 Smirny",
  "Т-97 рак": "T-97 Rak", "Т-113 пуля": "T-113 Bullet",
  "Т-274 вано": "T-274 Vano", "Т-578 алмаз": "T-578 Diamond",
  "Т-846 жук": "T-846 Beetle", "Т-1375 демон": "T-1375 Demon",
  "Т-2846 тема": "T-2846 Tema", "Т-5274 император": "T-5274 Emperor",
  "К.Р.-17 А.К.": "K.R.-17 A.K.", "К.Р.-27 акоп": "K.R.-27 Akop",
  "К.Р.-43 врач": "K.R.-43 Doctor", "К.Р.-56 эра": "K.R.-56 Era",
  "К.Р.-80 космос": "K.R.-80 Cosmos", "НОРТ-273 корнишон": "NORT-273 Gherkin",
  "НОРТ-287 заместитель": "NORT-287 Deputy", "НОРТ-356 кол": "NORT-356 Stake",
  "НОРТ-500 боб": "NORT-500 Bob"
}));
const letters = {
  А: "A", Б: "B", В: "V", Г: "G", Д: "D", Е: "E", Ё: "Yo", Ж: "Zh", З: "Z",
  И: "I", Й: "Y", К: "K", Л: "L", М: "M", Н: "N", О: "O", П: "P", Р: "R",
  С: "S", Т: "T", У: "U", Ф: "F", Х: "Kh", Ц: "Ts", Ч: "Ch", Ш: "Sh",
  Щ: "Shch", Ъ: "", Ы: "Y", Ь: "", Э: "E", Ю: "Yu", Я: "Ya"
};
function englishName(name) {
  if (overrides.has(name)) return overrides.get(name);
  return name.replace(/объект/gi, "Object").replace(/Объект/g, "Object")
    .replace(/[А-ЯЁа-яё]/g, (letter) => {
      const latin = letters[letter.toUpperCase()];
      return letter === letter.toLowerCase() ? latin.toLowerCase() : latin;
    });
}
function firstCell(line) {
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') { value += '"'; index += 1; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) break;
    else value += char;
  }
  return value.replace(/^\uFEFF/, "");
}
const lines = source.split(/\r?\n/);
let count = 0;
let filled = 0;
const result = lines.map((line) => {
  if (!line) return line;
  const name = firstCell(line).trim();
  const translation = englishName(name).trim();
  if (!translation || /[А-ЯЁа-яё]/.test(translation)) throw new Error(`Missing English name: ${name}`);
  const columns = line.match(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g)?.length + 1 || 1;
  if (columns !== 34 && columns !== 35) throw new Error(`Unexpected CSV width ${columns}: ${name}`);
  count += 1;
  if (columns === 35 && line.slice(line.lastIndexOf(",") + 1).trim()) return line;
  filled += 1;
  if (columns === 35) return line.replace(/,[^,]*$/, `,${translation}`);
  return `${line},${translation}`;
});
fs.writeFileSync(path, result.join(source.includes("\r\n") ? "\r\n" : "\n"), "utf8");
console.log(`English names present for ${count} tanks; filled ${filled} missing names.`);
