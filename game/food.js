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
      left: this.leftPos - this.size / 2,
      right: this.leftPos + this.size / 2,
      bottom: this.bottomPos - this.size / 2,
      top: this.bottomPos + this.size / 2,
    }
    return rect
  }
}
