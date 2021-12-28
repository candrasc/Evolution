import {
  getCustomProperty,
  setCustomProperty,
} from "./utils/updateCustomProperty.js"

import {
  normalize,
  cosineSim,
  dotProduct,
  getRandomInt,
} from "./utils/mathy.js"

import { spawnFight, spawnLove } from "./utils/animations.js"

let worldElem = document.querySelector("[data-world]")
export class Unit {
  constructor(
    elem,
    yVel,
    xVel,
    lifeDecay,
    mutationProba,
    health,
    attack,
    defense,
    lifespan,
    foodEfficiency,
    friendliness
  ) {
    this.elem = elem
    this.leftPos = getCustomProperty(this.elem, "--left")
    this.bottomPos = getCustomProperty(this.elem, "--bottom")
    this.size = getCustomProperty(this.elem, "--size")
    this.currAge = 0
    this.lifeDecay = lifeDecay
    this.mutationProba = mutationProba
    this.hungerDecay = 0.2 // Refactor as world property that is called when we increment

    this.coreStats = {
      attack: attack,
      health: health,
      defense: defense,
      // lifespan: lifespan,
      // foodEfficiency: foodEfficiency,
      // friendliness: friendliness,
    }
    this.currHealth = this.coreStats.health
    this.hunger = 50
    this.yVel = yVel
    this.xVel = xVel
    this.inactiveFrames = 0
    this.__mutate()
    this.__normStats()
    this.__setColor()
    console.log(this.coreStats)
  }

  static createUnitElem(left, bottom, size) {
    const unit = document.createElement("div")
    unit.dataset.unit = true
    unit.classList.add("unit")
    setCustomProperty(unit, "--left", left)
    setCustomProperty(unit, "--bottom", bottom)
    setCustomProperty(unit, "--size", size)
    worldElem.append(unit)
    return unit
  }

  __mutate() {
    const statKeys = Object.keys(this.coreStats)
    statKeys.forEach((key) => {
      let mutationRoll = Math.random()
      if (mutationRoll < this.mutationProba) {
        this.coreStats[key] = getRandomInt(100)
        console.log("MUTATE")
      }
    })
  }

  __normStats() {
    // Used to normalize stats to sum to 100
    const statKeys = Object.keys(this.coreStats)
    let vecOG = []
    let vecNorm

    statKeys.forEach((key) => {
      vecOG.push(this.coreStats[key])
    })

    vecNorm = normalize(vecOG)

    for (const [ind, key] of Object.entries(statKeys)) {
      this.coreStats[key] = vecNorm[ind] * 100
    }
  }

  __setColor() {
    // divide stats into vector of 3 to then convert to RGB
    // using cosine similarity to a vector of 100s
    const keys = Object.keys(this.coreStats)
    const div = Math.round(keys.length / 3)
    let ogVec = []
    let transVec = [[], [], []]
    let similarityVec = []
    keys.forEach((key) => {
      ogVec.push(this.coreStats[key])
    })

    for (let i = 0; i < ogVec.length; i++) {
      if (i < div) {
        transVec[0].push(ogVec[i])
      } else if (i < div * 2) {
        transVec[1].push(ogVec[i])
      } else {
        transVec[2].push(ogVec[i])
      }
    }

    for (let i = 0; i < transVec.length; i++) {
      let dotProd = dotProduct(transVec[i], transVec[i])
      similarityVec.push(dotProd)
    }
    // Now let's scale our values and set them
    let similarityVecNorm = normalize(similarityVec)
    setCustomProperty(this.elem, "--red", similarityVecNorm[0] * 256)
    setCustomProperty(this.elem, "--green", similarityVecNorm[1] * 256)
    setCustomProperty(this.elem, "--blue", similarityVecNorm[2] * 256)
  }

  getVecRep() {
    const keys = Object.keys(this.coreStats)

    let vec = []
    keys.forEach((key) => {
      vec.push(this.coreStats[key])
    })
    return vec
  }

  isAlive() {
    return (
      // this.currAge <= this.coreStats.lifespan &&
      this.currHealth > 0 && this.hunger > 0
    )
  }

  isActive() {
    return this.inactiveFrames <= 0
  }

  getCurrHealth() {
    return this.currHealth
  }

  getStats() {
    return this.coreStats
  }

  getRect() {
    let rect = {
      left: this.leftPos,
      right: this.leftPos + this.size,
      bottom: this.bottomPos,
      top: this.bottomPos + this.size,
    }
    return rect
  }

  setPosition(left, bottom) {
    setCustomProperty(this.elem, "--left", left)
    setCustomProperty(this.elem, "--bottom", bottom)
  }

  incrementInactive(time) {
    this.inactiveFrames = Math.max(this.inactiveFrames + time, 0)
  }

  incrementPosition(delta) {
    // switch velocities if at border

    let left = this.leftPos
    let bottom = this.bottomPos

    if (left <= 0) this.xVel = Math.abs(this.xVel)
    else if (left >= 100 - this.size) this.xVel = Math.abs(this.xVel) * -1

    if (bottom <= 0) this.yVel = Math.abs(this.yVel)
    else if (bottom >= 100 - this.size) this.yVel = Math.abs(this.yVel) * -1

    this.leftPos += this.xVel * delta
    this.bottomPos += this.yVel * delta

    setCustomProperty(this.elem, "--left", this.leftPos)
    setCustomProperty(this.elem, "--bottom", this.bottomPos)
  }

  decayAge(value) {
    this.currAge += value * this.lifeDecay
  }

  incrementHealth(value) {
    this.currHealth = Math.min(this.currHealth + value, this.coreStats.health)
  }

  decayHunger(value) {
    this.hunger += value * this.hungerDecay
  }

  incrementHunger(value) {
    this.hunger = Math.min(this.hunger + value, 100)
  }

  destroyElem() {
    // Used to clean out element before removing the object
    // Test without this and see what happens
    this.elem.remove()
  }
}

export class Units {
  constructor(damageMultiplier) {
    this.units = []
    this.foods = []
    this.DAMAGE_MULTIPLIER = damageMultiplier
    this.INTERACTION_COOLDOWN = 10
    this.FOOD_VALUE = 20
    this.KILL_VALUE = 50
  }
  addUnit(unit) {
    this.units.push(unit)
  }
  addFood(food) {
    this.foods.push(food)
  }

  incrementUnits(delta) {
    for (let i = this.units.length - 1; i >= 0; i--) {
      let unit = this.units[i]
      if (unit.isAlive()) {
        unit.incrementPosition(delta)
        unit.decayAge(1)
        unit.incrementInactive(-1)
        unit.decayHunger(-1)
      } else {
        unit.destroyElem()
        this.units.splice(i, 1)
      }
    }
  }
  incrementFood() {
    for (let i = this.foods.length - 1; i >= 0; i--) {
      let food = this.foods[i]
      if (!food.isActive()) {
        food.destroyElem()
        this.foods.splice(i, 1)
      }
    }
  }

  manageCollisions() {
    // Only let two units interact at once

    let collisions = new Set()

    for (let i = 0; i < this.units.length; i++) {
      for (let j = 0; j < this.units.length; j++) {
        if (j == i) continue
        let unitA = this.units[i]
        let unitB = this.units[j]

        if (!unitA.isActive() || !unitB.isActive()) continue
        if (collisions.has(unitA) || collisions.has(unitB)) continue

        if (this.__isCollision(unitA, unitB)) {
          const rand = Math.random()
          const chanceToMate =
            unitA.coreStats.friendliness + unitB.coreStats.friendliness
          if (0.5 >= rand) this.reproduce(unitA, unitB)
          else this.fight(unitA, unitB)

          collisions.add(unitA)
          collisions.add(unitB)
          unitA.incrementInactive(this.INTERACTION_COOLDOWN)
          unitB.incrementInactive(this.INTERACTION_COOLDOWN)
          // gives more random movements
          unitA.xVel *= -1
          unitB.yVel *= -1
        }
      }
      for (let j = 0; j < this.foods.length; j++) {
        let unit = this.units[i]
        let food = this.foods[j]

        if (!unit.isActive()) continue
        if (this.__isCollision(unit, food)) {
          unit.incrementHunger(this.FOOD_VALUE)
          food.setIsActive(false)
        }
      }
    }
    return collisions
  }

  fight(unit1, unit2) {
    const unitRect = unit1.getRect()
    const stats1 = unit1.getStats()
    const stats2 = unit2.getStats()

    let damageToOne = Math.max(
      stats2.attack * this.DAMAGE_MULTIPLIER - stats1.defense,
      0
    )
    let damageToTwo = Math.max(
      stats1.attack * this.DAMAGE_MULTIPLIER - stats2.defense,
      0
    )
    let health1 = unit1.getCurrHealth()
    let health2 = unit2.getCurrHealth()

    let kill1 = damageToOne >= health1
    let kill2 = damageToTwo >= health2

    // If you can kill the unit you take no damage and add its health to your own
    // If both units can kill each other they both die
    // Otherwise you both take damage
    if (kill1 && !kill2) {
      unit2.incrementHealth(health1)
      unit2.incrementHunger(this.KILL_VALUE)
      unit1.incrementHealth(-1 * damageToOne)
      spawnFight(unitRect.left, unitRect.bottom)
    } else if (kill2 && !kill1) {
      unit1.incrementHealth(health2)
      unit1.incrementHunger(this.KILL_VALUE)
      unit2.incrementHealth(-1 * damageToTwo)
      spawnFight(unitRect.left, unitRect.bottom)
    } else {
      unit1.incrementHealth(-1 * damageToOne)
      unit2.incrementHealth(-1 * damageToTwo)
    }
  }

  reproduce(unit1, unit2) {
    const stats1 = unit1.getStats()
    const stats2 = unit2.getStats()
    const healthRatio1 = unit1.getCurrHealth() / stats1.health
    const healthRatio2 = unit2.getCurrHealth() / stats2.health
    const hunger1 = unit1.hunger
    const hunger2 = unit2.hunger

    if (
      healthRatio1 < 0.45 ||
      healthRatio2 < 0.45 ||
      hunger1 < 45 ||
      hunger2 < 45
    ) {
      return
    }

    // set constant attributes
    const left = unit1.getRect().left
    const bottom = unit1.getRect().bottom
    const lifeDecay = unit1.lifeDecay
    const mutationProba = unit1.mutationProba
    // set core attributes
    const health = (stats1.health + stats2.health) / 2
    const attack = (stats1.attack + stats2.attack) / 2
    const defense = (stats1.defense + stats2.defense) / 2
    const lifespan = (stats1.lifespan + stats2.lifespan) / 2
    const foodEfficiency = (stats1.foodEfficiency + stats2.foodEfficiency) / 2
    const friendliness = (stats1.friendliness + stats2.friendliness) / 2

    const vX = Math.random()
    const vY = Math.random()

    const unitElem = Unit.createUnitElem(left, bottom, unit1.size)
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
    // Give some time before the spawned unit can interact. Prevents instant incest
    unit.incrementInactive(50)
    this.units.push(unit)
    spawnLove(left, bottom)
  }

  __isCollision(unit1, unit2) {
    const rect1 = unit1.getRect()
    const rect2 = unit2.getRect()

    let overlapX =
      (rect1.right >= rect2.left && rect1.right <= rect2.right) ||
      (rect1.left <= rect2.right && rect1.left >= rect2.left)

    let overlapY =
      (rect1.bottom >= rect2.bottom && rect1.bottom <= rect2.top) ||
      (rect1.top <= rect2.top && rect1.top >= rect2.bottom)

    return overlapX && overlapY
  }

  __simScore(unit1, unit2) {
    let vec1 = unit1.getVecRep()
    let vec2 = unit2.getVecRep()
    return cosineSim(vec1, vec2)
  }
}
