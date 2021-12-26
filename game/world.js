import { Unit, Units } from "./unit.js"

export class World {
  constructor() {
    this.elem = document.querySelector("[data-world]")
    this.units = new Units()
    this.foods = []
  }

  genUnits(numUnits, unitSize, unitV, lifeDecay) {
    for (let i = 0; i < numUnits; i++) {
      const left = getRandomInt(100 - unitSize)
      const bottom = getRandomInt(100 - unitSize)
      const health = getRandomInt(100)
      const attack = getRandomInt(100)
      const defense = getRandomInt(100)
      const lifespan = getRandomInt(100)
      const foodEfficiency = getRandomInt(100)
      const evasion = getRandomInt(100)

      let vX
      let vY
      if (unitV == null) {
        vX = Math.random()
        vY = Math.random()
      } else {
        vX = unitV
        vY = unitV
      }

      const unitElem = Unit.createUnitElem(left, bottom, unitSize)
      const unit = new Unit(
        unitElem,
        vX,
        vY,
        lifeDecay,
        health,
        attack,
        defense,
        lifespan,
        foodEfficiency,
        evasion
      )
      this.units.addUnit(unit)
    }
  }

  incrementUnits(delta) {
    this.units.increment(delta)
    let collisions = this.units.manageCollisions()
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

function cosinesim(A, B) {
  var dotproduct = 0
  var mA = 0
  var mB = 0
  for (let i = 0; i < A.length; i++) {
    // here you missed the i++
    dotproduct += A[i] * B[i]
    mA += A[i] * A[i]
    mB += B[i] * B[i]
  }
  mA = Math.sqrt(mA)
  mB = Math.sqrt(mB)
  var similarity = dotproduct / (mA * mB) // here you needed extra brackets
  return similarity
}

// var array1 = [1, 0, 0, 1]
// var array2 = [1, 0, 0, 0]

// var p = cosinesim(array1, array2)

// console.log(p)

// const left = getRandomInt(97)
// const bottom = getRandomInt(97)
// const health = getRandomInt(100)
// const attack = getRandomInt(100)
// const defense = getRandomInt(100)
// const lifespan = getRandomInt(100)

// const unitElem = Unit.createUnitElem(left, bottom)
// const unit = new Unit(unitElem, 0.1, 0.1, health, attack, defense, lifespan)
