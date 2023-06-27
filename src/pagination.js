export default class Paginator {
  constructor (size = 5) {
    this.size = size
    this.page = 1
    this
  }

  getRange (start = null, end = null) {
    start = start || this.page -1
    end = end || this.page
    return [this.size * start, end * (this.size) - 1]
  }
  
  next () {
    this.page++
    return this.getRange()
  }
}