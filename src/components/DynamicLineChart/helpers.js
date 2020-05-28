function isTouchEvent(event) {
  return !!event.touches;
}

export function getPosition(event) {
  return isTouchEvent(event)
    ? {
        x: event.changedTouches[event.changedTouches.length - 1].pageX,
        y: event.changedTouches[event.changedTouches.length - 1].pageY,
      }
    : { x: event.clientX, y: event.clientY };
}
