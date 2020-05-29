import { useRef, useEffect, useCallback } from "react";

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

function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

export function useThrottle(cb, delay) {
  const cbRef = useRef(cb);
  useEffect(() => {
    cbRef.current = cb;
  });
  return useCallback(
    // useDebounce is the same except we use debounceImpl here
    throttle((...args) => cbRef.current(...args), delay),
    [delay],
  );
}

export function animate({ duration = 144, timing, draw }) {
  const start = performance.now();
  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    const progress = timing(timeFraction);
    draw(progress);
    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
}
