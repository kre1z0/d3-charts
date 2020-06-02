import * as d3 from "d3";
import { chartContainer, xAxisClass } from "./styled";
import { getTranslate } from "./helpers";

export const onResize = ({ node, height, xAxisPosition, getMaxTranslateX }) => {
  const width = Math.min(window.innerWidth, node.getBoundingClientRect().width);
  const svg = d3.select(node).select("svg");
  svg.attr("viewBox", `0 0 ${width} ${height}`);
  const container = svg.select(`.${chartContainer}`);
  const xAxis = svg.select(`.${xAxisClass}`);
  const translateX = getTranslate(container);
  const rect = d3.select("rect");
  const newTranslateX = Math.max(Math.min(translateX, getMaxTranslateX()), 0);
  /** mutation **/
  rect.attr("width", width);
  container.attr("transform", `translate(-${newTranslateX}, 0)`);
  xAxis.attr("transform", `translate(-${newTranslateX}, ${xAxisPosition})`);
};
