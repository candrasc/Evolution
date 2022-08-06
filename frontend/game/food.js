export class Food {
  constructor(x, y, size) {
    this.xPos = x
    this.yPos = y
    this.size = size
    this.radius = size / 2
    this._isActive = true
  }

  getCenter() {
    return [this.xPos + this.radius, this.yPos + this.radius]
  }

  setIsActive(bool) {
    this._isActive = bool
  }

  isActive() {
    return this._isActive
  }

  getRect() {
    let rect = {
      left: this.xPos,
      right: this.xPos + this.size,
      bottom: this.yPos - this.size,
      top: this.yPos,
    }
    return rect
  }
}
