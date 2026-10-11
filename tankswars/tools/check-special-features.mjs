import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync("js/06-battle-logic.js", "utf8");
const section = (start, end) => {
  const from = source.indexOf(`    function ${start}(`);
  const to = source.indexOf(`    function ${end}(`, from);
  assert(from >= 0 && to > from, `Missing battle logic: ${start}`);
  return source.slice(from, to);
};

const tank = {
  health: 100,
  className: "ПТ",
  speed: 100,
  currentSpeed: 0,
  turnSpeed: 2,
  angle: 0,
  gunSpreadRadians: 0.1,
  siegeMode: { active: false, settledSeconds: 0 },
  features: ["13"]
};
const context = vm.createContext({
  tankIsAlive: (target) => target?.health > 0,
  tankIsInRiver: () => true,
  tankHasUniqueFeature: (target, code) => target.features?.includes(code) || false,
  allTerrainWaterSpeedMultiplier: 0.8,
  siegeSpeedMultiplier: 0.35,
  siegeTurnMultiplier: 0.6,
  siegeSpreadMultiplier: 0.5,
  siegeDeploySeconds: 0.8,
  getAliveBattleTanks: () => [tank],
  getRocketBoosterSpeedMultiplier: () => 1,
  normalizePositiveFloat: (value) => Number(value) || 0,
  normalizeAngle: (angle) => angle,
  battleState: { active: true, player: tank },
  renderBattleAmmoPanel: () => {}
});

vm.runInContext(section("setTankSiegeMode", "tankRepairKitIsReady"), context);
vm.runInContext(section("getTerrainSpeedMultiplier", "updateWaterRocking"), context);
vm.runInContext(section("updateTrackedSpeed", "moveTrackedTank"), context);
vm.runInContext(section("turnTrackedTank", "updateWheeledSpeed"), context);

assert.equal(context.getTerrainSpeedMultiplier(tank), 0.55);
tank.features = ["12"];
assert.equal(context.getTerrainSpeedMultiplier(tank), 0.8);
tank.features = ["10"];
assert.equal(context.getTerrainSpeedMultiplier(tank), 1);

assert.equal(context.setTankSiegeMode(tank, true), true);
assert.equal(context.setTankSiegeMode(tank, true), false);
assert.equal(context.getTankSiegeSpeedMultiplier(tank), 0.35);
assert.equal(context.getTankSiegeTurnMultiplier(tank), 0.6);
assert.equal(context.getTankGunSpreadRadians(tank), 0.1);
context.updateSiegeModeStabilization(0.79);
assert.equal(context.getTankGunSpreadRadians(tank), 0.1);
context.updateSiegeModeStabilization(0.01);
assert.equal(context.getTankGunSpreadRadians(tank), 0.05);
context.updateTrackedSpeed(tank, 1, 1);
assert.equal(tank.currentSpeed, 35);
assert.equal(context.getTankGunSpreadRadians(tank), 0.1);
context.updateSiegeModeStabilization(0.1);
assert.equal(tank.siegeMode.settledSeconds, 0);
context.turnTrackedTank(tank, 1, 1);
assert.equal(tank.angle, 1.2);
assert.equal(context.setTankSiegeMode(tank, false), true);
assert.equal(context.getTankSiegeSpeedMultiplier(tank), 1);

const rows = fs.readFileSync("data.csv", "utf8").split(/\r?\n/);
assert(rows.some((row) => row.startsWith("Объект 279,") && row.includes(",1,12,,,,РСФСР,Object 279")));
for (const name of ["Strv 103-O", "Strv 103A", "Strv 103B"]) {
  assert(rows.some((row) => row.startsWith(`${name},`) && row.includes(`,0,13,,,,Швеция,${name}`)));
}

console.log("Terrain mobility, siege controls, movement, stabilization and vehicle assignments passed.");
