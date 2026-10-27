import fs from "node:fs";
import { execFileSync } from "node:child_process";

const source = execFileSync("git", ["show", "HEAD:tankswars/data.csv"], { encoding: "utf8" });
let matches = 0;
const updated = source.replace(/^M2 Light,.*$/m, (line) => {
  matches += 1;
  const changed = line.replace(",1,,3,-6,20,", ",1,,2,-6,20,");
  if (changed === line) throw new Error("M2 Light availability column was not found");
  return changed;
});
if (matches !== 1) throw new Error(`Expected one M2 Light row, found ${matches}`);
fs.writeFileSync("data.csv", updated, "utf8");
for (const name of ["generate-balance-report.mjs", "generate-data-md.mjs"]) {
  const original = execFileSync("git", ["show", `HEAD:tankswars/tools/${name}`], { encoding: "utf8" });
  fs.writeFileSync(`tools/.temporary-${name}`, original, "utf8");
}
