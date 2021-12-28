import { Unit } from "./game/unit.js"
import { World } from "./game/world.js"

const NUM_UNITS = 100
const NUM_FOOD = 0
const FOOD_SPAWN_RATE = 5
const UNIT_DAMAGE_MULTIPLIER = 1.2
const MUTATION_PROBA = 1 / 100
const LIFE_DECAY = 0
const HUNGER_DECAY = 0.1
const FOOD_VALUE = 20
const KILL_VALUE = 50

const UNIT_SIZE = 2
const FOOD_SIZE = 2
// Null randomizes velocities
const UNIT_VELOCITY = null

const FPS = 30
const FPS_INTERVAL = 1000 / FPS
// Speedscale can be manipulated by user to slow or increase sim
let speedScale = 0.02
let world = new World(UNIT_DAMAGE_MULTIPLIER, MUTATION_PROBA)
// For fPS capping
let now, then, elapsed

// initialize the timer variables and start the animation

// window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart)

function handleStart(e) {
  if (e.code == "Space") {
    lastTime = null
    world.spawnUnits(NUM_UNITS, UNIT_SIZE, UNIT_VELOCITY, LIFE_DECAY)
    world.spawnFood(NUM_FOOD, FOOD_SIZE)
    // for fps capping
    then = Date.now()
    document.removeEventListener("keydown", handleStart)
    document.addEventListener("keydown", pause)
    window.requestAnimationFrame(update)
  }
}

let lastTime
let frameCount = 2
let paused = false
function update(time) {
  if (paused) {
    lastTime = null
    return
  }

  if (lastTime == null) {
    lastTime = time
    window.requestAnimationFrame(update)
  }
  now = Date.now()
  elapsed = now - then
  // if enough time has elapsed, draw the next frame
  if (elapsed > FPS_INTERVAL) {
    const delta = time - lastTime
    world.incrementUnits(delta * speedScale)
    lastTime = time
    then = now - (elapsed % FPS_INTERVAL)
    if (frameCount % Math.min(Math.round(FPS / FOOD_SPAWN_RATE, 1)) == 0) {
      world.spawnFood(1, FOOD_SIZE)
    }
    if (frameCount % 1000 == 0) world.cleanUpAnimations()

    frameCount += 1
  }
  window.requestAnimationFrame(update)
}

function pause(e) {
  if (e.code == "Space") {
    paused = true
    document.removeEventListener("keydown", pause)
    document.addEventListener("keydown", unpause)
  }
}

function unpause(e) {
  if (e.code == "Space") {
    paused = false
    document.removeEventListener("keydown", unpause)
    document.addEventListener("keydown", pause)
    window.requestAnimationFrame(update)
  }
}
