import { Unit } from "./game/unit.js"
import { World } from "./game/world.js"

const NUM_UNITS = 200
const NUM_FOOD = 10
const FOOD_SPAWN_RATE = 10
const UNIT_SIZE = 2
const FOOD_SIZE = 3
const UNIT_VELOCITY = null
const LIFE_DECAY = 0.1
const FPS = 30
const FPS_INTERVAL = 1000 / FPS
// Speedscale can be manipulated by user to slow or increase sim
let speedScale = 0.02
let world = new World()
// For fPS capping
let now, then, elapsed

// initialize the timer variables and start the animation

// window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart, { once: true })

function handleStart() {
  lastTime = null
  world.spawnUnits(NUM_UNITS, UNIT_SIZE, UNIT_VELOCITY, LIFE_DECAY)
  world.spawnFood(NUM_FOOD, FOOD_SIZE)
  // for fps capping
  then = Date.now()

  window.requestAnimationFrame(update)
}

let lastTime
function update(time) {
  if (lastTime == null) {
    lastTime = time
    window.requestAnimationFrame(update)
    return
  }
  now = Date.now()
  elapsed = now - then
  // if enough time has elapsed, draw the next frame
  if (elapsed > FPS_INTERVAL) {
    const delta = time - lastTime
    world.incrementUnits(delta * speedScale)
    world.spawnFood(FOOD_SPAWN_RATE, FOOD_SIZE)
    lastTime = time
    then = now - (elapsed % FPS_INTERVAL)
  }
  window.requestAnimationFrame(update)
}
