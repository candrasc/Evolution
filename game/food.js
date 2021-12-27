import {
  getCustomProperty,
  setCustomProperty,
} from "./utils/updateCustomProperty.js"

import { getRandomInt } from "./utils/mathy.js"

let worldElem = document.querySelector("[data-world]")

export class Food {
  constructor(elem) {
    this.elem = elem
    this.leftPos = getCustomProperty(this.elem, "--left")
    this.bottomPos = getCustomProperty(this.elem, "--bottom")
    this.size = getCustomProperty(this.elem, "--size")
    this._isActive = true
  }

  static createFoodElem(left, bottom, size) {
    const food = document.createElement("img")
    const imgNum = getRandomInt(3)
    food.dataset.food = true
    food.classList.add("food")
    food.src = `game/imgs/donut.png`

    setCustomProperty(food, "--left", left)
    setCustomProperty(food, "--bottom", bottom)
    setCustomProperty(food, "--size", size)
    worldElem.append(food)
    return food
  }

  setIsActive(bool) {
    this._isActive = bool
  }

  isActive() {
    return this._isActive
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

  destroyElem() {
    // Used to clean out element before removing the object
    // Test without this and see what happens
    this.elem.remove()
  }
}
