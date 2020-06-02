import * as d3 from "d3";
import { useRef, useEffect, useCallback } from "react";
import ru from "date-fns/locale/ru";

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
  let requestId;

  requestAnimationFrame(function requestAnimate(time) {
    let timeFraction = (time - start) / duration;

    if (timeFraction < 1) {
      requestId = requestAnimationFrame(requestAnimate);
    }

    if (timeFraction > 1) timeFraction = 1;
    const progress = timing(timeFraction);
    draw(progress, requestId);
  });
}

export const easeOutQuad = (t) => t * (2 - t);

export const getShortMonts = (lower) =>
  Array.from({ length: 12 }, (_, monthIndex) => {
    const str = ru.localize.month(monthIndex, { width: "abbreviated" }).substring(0, 3);

    if (lower) {
      return str;
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
  });

export const getTranslate = (element, y = false) => {
  return Math.abs((element.attr("transform") || `translate(0, 0)`).match(/(-?[0-9\.]+)/g)[y ? 1 : 0]);
};
