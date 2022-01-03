export class Food {
  constructor(left, bottom, size) {
    this.leftPos = left
    this.bottomPos = bottom
    this.size = size
    this._isActive = true
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
}
