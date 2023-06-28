export class OnHold {
  static options = {
    delay: 1000,
    maxTravel: 10 // maximum distance mouse can move before the event is aborted
  }

  constructor (callback, options = {}) {
    this.timeOutId = null
    this.callback = callback

    // Mouse / touch
    this.distance = 0
    this.clientX = null
    this.clientY = null

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
      const source = event.touches
        ? event.touches[0]
        : event

      const clientX = source.clientX
      const clientY = source.clientY

      if(this.clientX) {
        this.distance += Math.sqrt((this.clientX - clientX) ** 2 + (this.clientY - clientY) ** 2);
        
        if (this.distance > this.options.maxTravel) {
          this.end(event)
        }
      }
      this.clientX = clientX
      this.clientY = clientY
    }
  }

  reset () {
    this.timeOutId = null
    this.distance = 0
    this.clientX = null
    this.clientY = null
  }
}