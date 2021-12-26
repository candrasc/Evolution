import { Unit } from "./game/unit.js"
import { World } from "./game/world.js"

const NUM_UNITS = 200
const UNIT_SIZE = 3
const UNIT_VELOCITY = 0.2
const FPS = 30
const FPS_INTERVAL = 1000 / FPS
// Speedscale can be manipulated by user to slow or increase sim
let speedScale = 0.05
let world = new World()
// For fPS capping
let now, then, elapsed

// initialize the timer variables and start the animation

// window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart, { once: true })

function handleStart() {
  lastTime = null
  world.genUnits(NUM_UNITS, UNIT_SIZE, UNIT_VELOCITY)
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
    lastTime = time
    then = now - (elapsed % FPS_INTERVAL)
  }
  window.requestAnimationFrame(update)
}
