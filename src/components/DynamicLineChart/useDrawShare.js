import { shareClass } from "./styled";

export const useDrawShare = ({ node, chart, widthByItems, tickY1, tickY2, svg, ...props }) => {
  if (node) {
    const shareContainer = chart.append("g").attr("class", shareClass);
    const linearGradientId = "shareGradient";
    const shareWidth = 175;
    const shareX = widthByItems - 400;
    const shareLine = shareContainer
      .append("line")
      .attr("y1", tickY1)
      .attr("y2", tickY2)
      .attr("stroke", "rgba(255, 218, 121, 1)")
      .attr("shape-rendering", "crispEdges")
      .attr("stroke-width", 1)
      .attr("x1", shareX)
      .attr("x2", shareX);

    const rightshareLine = shareLine.node().cloneNode(true);
    rightshareLine.setAttribute("x1", shareX + shareWidth);
    rightshareLine.setAttribute("x2", shareX + shareWidth);
    shareContainer.node().appendChild(rightshareLine);

    shareContainer
      .append("rect")
      .attr("width", shareWidth)
      .attr("y", Math.ceil(tickY2))
      .attr("x", shareX)
      .attr("height", Math.ceil(tickY1 - tickY2))
      .attr("fill", `url(#${linearGradientId})`)
      .style("pointer-events", "none");
    const linearGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", linearGradientId)
      .attr("gradientTransform", "rotate(90)");

    linearGradient.append("stop").attr("offset", "0%").attr("stop-color", "rgba(255, 218, 121, 0.2)");
    linearGradient.append("stop").attr("offset", "52.6%").attr("stop-color", "rgba(255, 218, 121, 0.1)");
    linearGradient.append("stop").attr("offset", "100%").attr("stop-color", "rgba(255, 218, 121, 0.2)");
    const shareTooltip = shareContainer
      .append("path")
      .attr("fill", "rgba(255, 218, 121, 1)")
      .attr("transform", `translate(${shareX + shareWidth - 20}, ${tickY2 + 5})`)
      .attr(
        "d",
        "M7 14C10.8658 14 14 10.8658 14 7C14 3.13425 10.8658 0 7 0C3.13425 0 0 3.13425 0 7C0 10.8658 3.13425 14 7 14ZM7.79625 10.7537H6.20375V5.66125H7.805L7.79625 10.7537ZM6.195 3.381H7.79625V4.78625H6.2125L6.195 3.381Z",
      );
    const shareText = shareContainer
      .append("text")
      .text("Акция - 20%")
      .attr("fill", "rgba(255, 218, 121, 1)")
      .attr("x", shareX + 5)
      .attr("y", tickY2 + 15)
      .attr("font-size", 12);
  }
};
