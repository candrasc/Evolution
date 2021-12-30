import { Unit, Units } from "./unit.js"
import { Food } from "./food.js"
import { getRandomInt } from "./utils/mathy.js"
import {
  cleanUpFightAnimations,
  cleanUpLoveAnimations,
} from "./utils/animations.js"

export class World {
  constructor() {
    this.elem = document.querySelector("[data-world]")
    this.units = new Units()
  }

  spawnUnits(numUnits, unitSize, unitV, lifeDecay) {
    for (let i = 0; i < numUnits; i++) {
      const mutationProba = 1 / 1000
      const left = getRandomInt(100 - unitSize)
      const bottom = getRandomInt(100 - unitSize)
      const health = getRandomInt(100)
      const attack = getRandomInt(100)
      const defense = getRandomInt(100)
      const lifespan = getRandomInt(100)
      const foodEfficiency = getRandomInt(100)
      const friendliness = getRandomInt(100)

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
        mutationProba,
        health,
        attack,
        defense,
        lifespan,
        foodEfficiency,
        friendliness
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

  incrementUnits(
    delta,
    foodValue,
    killValue,
    hungerDecay,
    ageDecay,
    mutationProba,
    damageMultiplier
  ) {
    this.units.incrementUnits(delta, hungerDecay, ageDecay)
    this.units.incrementFood()
    this.units.manageCollisions(
      foodValue,
      killValue,
      mutationProba,
      damageMultiplier
    )
  }

  cleanUpAnimations() {
    cleanUpFightAnimations()
    cleanUpLoveAnimations()
  }
}
