import { Unit, Units } from "./unit.js"
import { Food } from "./food.js"
import { getRandomInt } from "./utils/mathy.js"

export class World {
  constructor() {
    this.elem = document.querySelector("[data-world]")
    this.units = new Units()
  }

  spawnUnits(numUnits, unitSize, unitV, lifeDecay) {
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

  spawnFood(numFood, unitSize) {
    for (let i = 0; i < numFood; i++) {
      const left = getRandomInt(100 - unitSize)
      const bottom = getRandomInt(100 - unitSize)
      const foodElem = Food.createFoodElem(left, bottom, unitSize)
      const food = new Food(foodElem)
      this.units.addFood(food)
    }
  }

  incrementUnits(delta) {
    this.units.incrementUnits(delta)
    this.units.incrementFood()
    this.units.manageCollisions()
  }
}
