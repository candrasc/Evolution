import { Unit, Units } from "./unit.js"
import { Food } from "./food.js"
import { getRandomInt } from "./utils/mathy.js"
import {
  cleanUpFightAnimations,
  cleanUpLoveAnimations,
} from "./utils/animations.js"

export class World {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.units = new Units()
    this.foodImage = this.__setFoodImage()
  }

  __setFoodImage() {
    const image = new Image()
    image.src = "game/imgs/donut.png"
    return image
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

      const unit = new Unit(
        left,
        bottom,
        unitSize,
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
      const food = new Food(left, bottom, unitSize)
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

  drawAll(ctx) {
    let units = this.units.units
    let foods = this.units.foods

    units.forEach((unit) => {
      this.__drawUnit(ctx, unit)
    })

    foods.forEach((food) => {
      this.__drawFood(ctx, food)
    })
  }

  __drawUnit(ctx, unit) {
    const x = unit.leftPos * this.width * 0.01
    const y = unit.bottomPos * this.height * 0.01
    const size = unit.size * this.width * 0.01

    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = unit.getColor()
    ctx.fill()
  }

  __drawFood(ctx, food) {
    const x = food.leftPos * this.width * 0.01
    const y = food.bottomPos * this.height * 0.01
    const size = food.size * this.width * 0.01

    ctx.beginPath()
    ctx.drawImage(this.foodImage, x, y, size, size)
    ctx.fill()
  }
}
