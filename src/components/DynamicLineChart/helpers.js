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

export function detectMob() {
  const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
}
