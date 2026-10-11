import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync("js/06-battle-logic.js", "utf8");
const start = source.indexOf("    function updateTrackedSpeed(");
const end = source.indexOf("    function updateWheeledSpeed(", start);
assert(start >= 0 && end > start, "Tracked movement functions are missing");

let collides = false;
let lastDistance = 0;
const context = vm.createContext({
  getRocketBoosterSpeedMultiplier: (tank) => tank.rocketBooster?.activeTime > 0 ? 1.5 : 1,
  getTankSiegeSpeedMultiplier: () => 1,
  getTankSiegeTurnMultiplier: () => 1,
  tankMobilityIsBroken: (tank) => Boolean(tank.mobilityBroken),
  moveTank: (_tank, distance) => {
    lastDistance = distance;
    return !collides;
  }
});
vm.runInContext(source.slice(start, end), context);

const heavy = { speed: 100, currentSpeed: 0, className: "ТТ" };
assert.equal(context.moveTrackedTank(heavy, 1, 0.25), true);
assert.equal(heavy.currentSpeed, 20);
assert.equal(lastDistance, 5);
for (let index = 0; index < 5; index += 1) context.updateTrackedSpeed(heavy, 1, 0.25);
assert.equal(heavy.currentSpeed, 100);

context.updateTrackedSpeed(heavy, 0, 0.1);
assert.equal(heavy.currentSpeed, 83);
context.updateTrackedSpeed(heavy, -1, 0.1);
assert.equal(heavy.currentSpeed, 59);
context.updateTrackedSpeed(heavy, -1, 0.3);
assert(heavy.currentSpeed < 0 && heavy.currentSpeed >= -65);

const boosted = { speed: 100, currentSpeed: 0, className: "ТТ", rocketBooster: { activeTime: 10 } };
context.updateTrackedSpeed(boosted, 1, 2);
assert.equal(boosted.currentSpeed, 150);
boosted.rocketBooster.activeTime = 0;
context.updateTrackedSpeed(boosted, 1, 0.1);
assert(boosted.currentSpeed < 150 && boosted.currentSpeed > 100);

collides = true;
assert.equal(context.moveTrackedTank(boosted, 1, 0.1), false);
assert.equal(boosted.currentSpeed, 0);
collides = false;
boosted.mobilityBroken = true;
assert.equal(context.moveTrackedTank(boosted, 1, 0.1), false);
assert.equal(boosted.currentSpeed, 0);

const bot = { speed: 100, currentSpeed: 0, className: "ТТ" };
context.updateTrackedSpeed(bot, 1, 2, 0.5);
assert.equal(bot.currentSpeed, 50);

const steeringStart = source.indexOf("    function turnTrackedTank(");
const steeringEnd = source.indexOf("    function updateWheeledSpeed(", steeringStart);
assert(steeringStart >= 0 && steeringEnd > steeringStart, "Tracked steering function is missing");
const steeringContext = vm.createContext({ normalizeAngle: (angle) => angle, getTankSiegeTurnMultiplier: () => 1 });
vm.runInContext(source.slice(steeringStart, steeringEnd), steeringContext);
const steeringTank = { angle: 0, turnSpeed: 1, currentSpeed: 50 };
steeringContext.turnTrackedTank(steeringTank, -1, 0.25);
assert.equal(steeringTank.angle, -0.25, "Forward left must turn the hull left");
steeringTank.angle = 0;
steeringTank.currentSpeed = -50;
steeringContext.turnTrackedTank(steeringTank, -1, 0.25);
assert.equal(steeringTank.angle, 0.25, "Reverse left must turn the rear left");
steeringTank.angle = 0;
steeringContext.turnTrackedTank(steeringTank, 1, 0.25);
assert.equal(steeringTank.angle, -0.25, "Reverse right must turn the rear right");
steeringTank.angle = 0;
steeringTank.currentSpeed = 10;
steeringContext.turnTrackedTank(steeringTank, -1, 0.25);
assert.equal(steeringTank.angle, -0.25, "Steering must follow actual speed while braking for reverse");

let teleports = 0;
const stuckContext = vm.createContext({
  tankIsAlive: (tank) => tank.health > 0,
  tankMobilityIsBroken: (tank) => Boolean(tank.mobilityBroken),
  normalizePositiveFloat: (value) => Math.max(0, Number(value) || 0),
  teleportStuckTank: (tank) => { teleports += 1; tank.stuckMoveTimer = 0; }
});
const stuckStart = source.indexOf("    function updateTankStuckRecovery(");
const stuckEnd = source.indexOf("    function updateReloadTimers(", stuckStart);
const botStuckStart = source.indexOf("    function updateBotStuckState(");
const botStuckEnd = source.indexOf("    function updateBotTank(", botStuckStart);
assert(stuckStart >= 0 && stuckEnd > stuckStart && botStuckStart >= 0 && botStuckEnd > botStuckStart);
vm.runInContext(source.slice(stuckStart, stuckEnd), stuckContext);
vm.runInContext(source.slice(botStuckStart, botStuckEnd), stuckContext);

const slowTank = { health: 100, speed: 100, x: 0, y: 0, stuckLastX: 0, stuckLastY: 0, stuckMoveTimer: 0 };
for (let frame = 0; frame < 360; frame += 1) {
  slowTank.x += 1.2;
  stuckContext.updateTankStuckRecovery(slowTank, true, 1 / 60);
}
assert.equal(teleports, 0);
for (let frame = 0; frame < 301; frame += 1) stuckContext.updateTankStuckRecovery(slowTank, true, 1 / 60);
assert.equal(teleports, 1);

const slowBot = {
  speed: 100, x: 0, y: 0, botLastX: 0, botLastY: 0,
  botStuckTimer: 0, botOrbitDirection: 1, botAvoidTimer: 0
};
for (let frame = 0; frame < 90; frame += 1) {
  slowBot.x += 1.2;
  stuckContext.updateBotStuckState(slowBot, 1 / 60);
}
assert.equal(slowBot.botOrbitDirection, 1);
console.log("Tank movement: acceleration, reversing, steering, boosters, collision, bot speed and stuck recovery passed.");
