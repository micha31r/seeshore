const holdDuration = 500
let id, isHold = false

export function onHold(callback) {
  isHold = false
  id = setTimeout(() => {
    isHold = true;
    callback()
  }, holdDuration)
}

export function onTap(callback) {
  clearTimeout(id)
  if (!isHold) {
    callback()
  }
}