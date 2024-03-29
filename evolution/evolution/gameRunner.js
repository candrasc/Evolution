import { Unit } from "./unit.js"
import { World } from "./world.js"
import { updateChart } from "./utils/charts.js"

let NUM_UNITS = 100
let NUM_FOOD = 10
let BASE_FOOD_SPAWN_RATE = 15
let BASE_AGE_DECAY = 0
let BASE_HUNGER_DECAY = 2
let UNIT_DAMAGE_MULTIPLIER = 1
let MUTATION_PROBA = 1 / 100

let FOOD_VALUE = 20
let KILL_VALUE_MULTIPLIER = 1

const UNIT_SIZE = 1.25
const FOOD_SIZE = 1
// Null randomizes velocities
const UNIT_VELOCITY = null

let FOOD_SPAWN_RATE
let AGE_DECAY
let HUNGER_DECAY = 2
let SIMULATION_SPEED = 5

const FPS = 50
const FPS_INTERVAL = 1000 / FPS

const canvas = document.getElementById("world")
canvas.style.width = "100%"
canvas.style.height = "100%"
// ...then set the internal size to match
canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight
const ctx = canvas.getContext("2d")

// screenelements
const startScreenElem = document.querySelector("[data-start-screen]")
const unpauseScreenElem = document.querySelector("[data-unpause-screen]")
const speedInput = document.getElementById("speedSlider")
const hungerDecayInput = document.getElementById("hungerDecaySlider")
const foodSpawnInput = document.getElementById("foodSpawnSlider")
const foodValueInput = document.getElementById("foodValueSlider")
const killInput = document.getElementById("killSlider")
const mutationInput = document.getElementById("mutationSlider")
const damageInput = document.getElementById("damageSlider")

// Speedscale can be manipulated by user to slow or increase sim

let world = new World(canvas.width, canvas.height)
// For fPS capping
let now, then, elapsed

function setSimulationSpeed(speed) {
  FOOD_SPAWN_RATE = BASE_FOOD_SPAWN_RATE * speed
  //AGE_DECAY = BASE_AGE_DECAY * speed
  // HUNGER_DECAY = BASE_HUNGER_DECAY * speed
}

function setHungerDecay(value) {
  HUNGER_DECAY = value
}

function setFoodSpawnRate(value) {
  FOOD_SPAWN_RATE = value * SIMULATION_SPEED
  BASE_FOOD_SPAWN_RATE = value
}

function setFoodValue(value) {
  FOOD_VALUE = value
}

function setkillValueMultiplier(value) {
  KILL_VALUE_MULTIPLIER = value
}

function setMutationProba(value) {
  MUTATION_PROBA = value
}

function setDamageMultiplier(value) {
  UNIT_DAMAGE_MULTIPLIER = value
}

// window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart)
speedInput.addEventListener("mouseup", function () {
  SIMULATION_SPEED = parseFloat(this.value)
  setSimulationSpeed(SIMULATION_SPEED)
})
killInput.addEventListener("mouseup", function () {
  setkillValueMultiplier(parseFloat(this.value))
})
foodSpawnInput.addEventListener("mouseup", function () {
  setFoodSpawnRate(parseFloat(this.value))
})
foodValueInput.addEventListener("mouseup", function () {
  setFoodValue(parseFloat(this.value))
})
killInput.addEventListener("mouseup", function () {
  setkillValueMultiplier(parseFloat(this.value))
})
mutationInput.addEventListener("mouseup", function () {
  setMutationProba(parseFloat(this.value))
})
damageInput.addEventListener("mouseup", function () {
  setDamageMultiplier(parseFloat(this.value))
})

hungerDecayInput.addEventListener("mouseup", function () {
  setHungerDecay(parseFloat(this.value))
})

function handleStart(e) {
  if (e.code == "Space") {
    startScreenElem.classList.add("hide")
    lastTime = null
    setSimulationSpeed(SIMULATION_SPEED)
    world.spawnUnits(NUM_UNITS, UNIT_SIZE, UNIT_VELOCITY)
    world.spawnFood(NUM_FOOD, FOOD_SIZE)
    world.drawAll(ctx)
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
    const delta = (time - lastTime) * 0.01 * SIMULATION_SPEED

    world.incrementUnits(
      delta,
      FOOD_VALUE,
      KILL_VALUE_MULTIPLIER,
      HUNGER_DECAY,
      AGE_DECAY,
      MUTATION_PROBA,
      UNIT_DAMAGE_MULTIPLIER
    )
    lastTime = time
    then = now - (elapsed % FPS_INTERVAL)

    if (
      FOOD_SPAWN_RATE != 0 &&
      frameCount % Math.max(Math.round(FPS / FOOD_SPAWN_RATE), 1) == 0
    ) {
      world.spawnFood(1, FOOD_SIZE)
    }

    if (frameCount % 10 == 0) {
      let stats = world.getUnitStats()
      updateChart([stats["attack"], stats["defense"], stats["health"]])
      frameCount = 0
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    world.drawAll(ctx)
    frameCount += 1
  }

  window.requestAnimationFrame(update)
}

function pause(e) {
  if (e.code == "Space") {
    paused = true
    document.removeEventListener("keydown", pause)
    document.addEventListener("keydown", unpause)
    unpauseScreenElem.classList.remove("hide")
  }
}

function unpause(e) {
  if (e.code == "Space") {
    paused = false
    document.removeEventListener("keydown", unpause)
    document.addEventListener("keydown", pause)
    unpauseScreenElem.classList.add("hide")
    window.requestAnimationFrame(update)
  }
}
