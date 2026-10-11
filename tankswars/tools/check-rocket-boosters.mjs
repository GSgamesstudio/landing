import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync("js/06-battle-logic.js", "utf8");
const section = (start, end) => {
  const from = source.indexOf(`    function ${start}(`);
  const to = source.indexOf(`    function ${end}(`, from);
  assert(from >= 0 && to > from, `Missing battle logic section: ${start}`);
  return source.slice(from, to);
};

let renders = 0;
const tank = { health: 100, rocketBooster: { activeTime: 0, cooldown: 0 } };
const battleState = { active: true, player: tank };
const context = vm.createContext({
  rocketBoosterDuration: 10,
  rocketBoosterCooldown: 30,
  rocketBoosterSpeedMultiplier: 1.5,
  tankIsAlive: (target) => target?.health > 0,
  tankMobilityIsBroken: (target) => Boolean(target?.mobilityBroken),
  getAliveBattleTanks: () => [tank],
  renderBattleAmmoPanel: () => { renders += 1; },
  battleState
});
vm.runInContext(section("getRocketBoosterSpeedMultiplier", "tankRepairKitIsReady"), context);
vm.runInContext(section("updateRocketBoosterTimers", "updatePlayerTank"), context);

assert.equal(context.getRocketBoosterSpeedMultiplier(tank), 1);
assert.equal(context.activateTankRocketBooster(tank), true);
assert.equal(context.activateTankRocketBooster(tank), false);
assert.equal(context.getRocketBoosterSpeedMultiplier(tank), 1.5);
context.updateRocketBoosterTimers(9.5);
assert.equal(tank.rocketBooster.activeTime, 0.5);
context.updateRocketBoosterTimers(0.5);
assert.equal(tank.rocketBooster.activeTime, 0);
assert.equal(tank.rocketBooster.cooldown, 30);
assert.equal(context.getRocketBoosterSpeedMultiplier(tank), 1);
assert.equal(context.activateTankRocketBooster(tank), false);
context.updateRocketBoosterTimers(29.5);
assert.equal(tank.rocketBooster.cooldown, 0.5);
context.updateRocketBoosterTimers(0.5);
assert.equal(tank.rocketBooster.cooldown, 0);
assert.equal(context.activateTankRocketBooster(tank), true);

tank.rocketBooster.activeTime = 0;
tank.rocketBooster.cooldown = 0;
tank.mobilityBroken = true;
assert.equal(context.activateTankRocketBooster(tank), false);
tank.mobilityBroken = false;
context.usePlayerRocketBooster();
assert.equal(tank.rocketBooster.activeTime, 10);
assert(renders > 0);

context.updateRocketBoosterTimers(11);
assert.equal(tank.rocketBooster.cooldown, 29);
console.log("Rocket boosters: activation, 10 s duration, 30 s cooldown and speed bonus passed.");
