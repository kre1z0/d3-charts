import * as d3 from "d3";

export function stackMin(serie) {
  return d3.min(serie, (d) => d[0]);
}

export function stackMax(serie) {
  return d3.max(serie, (d) => d[1]);
}

export function getWidthByPercent(width, percent) {
  return ((width) * percent) / 100;
}
