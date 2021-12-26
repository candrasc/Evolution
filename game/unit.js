import {
  getCustomProperty,
  setCustomProperty,
} from "./utils/updateCustomProperty.js"

import { normalize, cosineSim, dotProduct } from "./utils/mathy.js"

let worldElem = document.querySelector("[data-world]")

export class Unit {
  constructor(
    elem,
    yVel,
    xVel,
    health,
    attack,
    defense,
    lifespan,
    foodEfficiency
  ) {
    this.elem = elem
    this.leftPos = getCustomProperty(this.elem, "--left")
    this.bottomPos = getCustomProperty(this.elem, "--bottom")
    this.size = getCustomProperty(this.elem, "--size")
    this.currLife = lifespan
    this.lifeDecay = 0.1

    this.coreStats = {
      health: health,
      attack: attack,
      defense: defense,
      lifespan: lifespan,
      foodEfficiency: foodEfficiency,
    }
    this.__normStats()
    this.__setColor()
    this.yVel = yVel
    this.xVel = xVel
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

    // console.log(comparisonVec)
    // console.log(transVec)
    console.log(similarityVecNorm)
  }

  isAlive() {
    return this.currLife > 0
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

  incrementPosition(delta) {
    // switch velocities if at border

    let left = this.leftPos
    let bottom = this.bottomPos

    if (left <= 0) this.xVel = Math.abs(this.xVel)
    else if (left >= 97) this.xVel = Math.abs(this.xVel) * -1

    if (bottom <= 0) this.yVel = Math.abs(this.yVel)
    else if (bottom >= 97) this.yVel = Math.abs(this.yVel) * -1

    this.leftPos += this.xVel * delta
    this.bottomPos += this.yVel * delta

    setCustomProperty(this.elem, "--left", this.leftPos)
    setCustomProperty(this.elem, "--bottom", this.bottomPos)
  }

  incrementLife() {
    this.currLife -= this.lifeDecay
  }

  destroyElem() {
    // Used to clean out element before removing the object
    // Test without this and see what happens
    this.elem.remove()
  }
}

export class Units {
  constructor() {
    this.units = []
  }
  addUnit(unit) {
    this.units.push(unit)
  }
  increment(delta) {
    for (let i = this.units.length - 1; i >= 0; i--) {
      let unit = this.units[i]
      if (unit.isAlive()) {
        unit.incrementPosition(delta)
        unit.incrementLife()
      } else {
        unit.destroyElem()
        this.units.splice(i, 1)
      }
    }
  }
  checkCollisions() {
    // split vector into 3. That wway you can take cos sim of each vector and use it for rgb values

    let collisions = []
    let currUnits = []

    this.units.forEach((unit) => {
      currUnits.push(unit.getRect())
    })
    // is it possible  getRect() is expensive? Could store them in first iteration
    for (let i = 0; i < currUnits.length; i++) {
      for (let j = 0; j < currUnits.length; j++) {
        if (j == i) continue
        let unitA = currUnits[i]
        let unitB = currUnits[j]
        if (this.__isCollision(unitA, unitB)) {
          collisions.push([unitA, unitB])
        }
      }
    }
    return collisions
  }
  __isCollision(rect1, rect2) {
    return (
      rect1.left < rect2.right &&
      rect1.top < rect2.bottom &&
      rect1.right > rect2.left &&
      rect1.bottom > rect2.top
    )
  }
}
