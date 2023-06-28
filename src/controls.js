export class OnHold {
  static options = {
    delay: 1000,
    maxTravel: 10 // maximum distance mouse can move before the event is aborted
  }

  constructor (callback, options = {}) {
    this.timeOutId = null
    this.callback = callback
    this.mouseDistance = 0
    this.mousePosX = null
    this.mousePosY = null
    this.options = {
      ...this.constructor.options,
      ...options
    }
  }

  start (event) {
    this.timeOutId = setTimeout(() => {
      this.callback()
    }, this.options.delay)
  }

  end (event) {
    if (this.timeOutId) {
      clearTimeout(this.timeOutId)
      this.reset()
    }
  }

  move (event) {
    if (this.timeOutId) {
      if(this.mousePosX) {
        this.mouseDistance += Math.sqrt((this.mousePosY - event.clientY) ** 2 + (this.mousePosX - event.clientX) ** 2);
        
        if (this.mouseDistance > this.options.maxTravel) {
          this.end(event)
        }
      }
      this.mousePosX = event.clientX
      this.mousePosY = event.clientY
    }
  }

  reset () {
    this.timeOutId = null
    this.mouseDistance = 0
    this.mousePosX = null
    this.mousePosY = null
  }
}