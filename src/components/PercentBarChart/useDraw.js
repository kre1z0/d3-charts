import * as d3 from "d3";
import { useCallback } from "react";

import { roundedRect } from "helpers/rect";
import { getWidthByPercent } from "helpers/stack";

export function useDraw(props) {
  const ref = useCallback(
    (node) => {
      if (node !== null) {
        const { colors, data } = props;
        const labels = Object.keys(props.data).sort((a, b) => b - a);
        const width = Math.min(props.width, node.getBoundingClientRect().width);
        const barHeight = 16;
        const barPadding = 4;
        const margin = { top: 0, right: 80, bottom: 20, left: 40 };
        const height = Math.ceil(labels.length * barHeight) + barPadding * labels.length + margin.top + margin.bottom;

        /** SVG **/
        d3.select(node).select("svg").remove();
        const svg = d3.select(node).append("svg").attr("viewBox", `0 0 ${width} ${height}`);

        /** X - axis **/
        const xScale = d3
          .scaleLinear()
          .domain([0, 10])
          .range([0, width - margin.left]);

        const yScale = d3
          .scaleBand()
          .domain(d3.range(labels.length))
          .rangeRound([margin.top, height - margin.bottom])
          .padding(0.1);

        svg
          .append("g")
          .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
          .call(d3.axisBottom(xScale).tickFormat((n) => `${n * 10}%`))
          .call((g) => {
            g.selectAll(".domain, line").remove();
            g.selectAll("g text").each((d, i, e) => {
              if (i === 0 || i === e.length - 1) {
                e[i].setAttributeNS(null, "text-anchor", i === 0 ? "start" : "end");
              }
            });
          });

        svg
          .append("g")
          .attr("transform", `translate(${margin.left}, ${0})`)
          .call(
            d3
              .axisLeft(yScale)
              .tickFormat((d) => labels[d])
              .tickSizeOuter(0),
          )
          .selectAll(".domain, line")
          .remove();

        for (let i = 0; i < labels.length; i++) {
          const yearData = data[labels[i]];

          svg
            .append("g")
            .attr("transform", `translate(${margin.left}, ${barHeight * i + (i > 0 ? barPadding * i + 1 : 0)})`)
            .selectAll("path")
            .data(yearData)
            .join("path")
            .attr("fill", (d, index) => colors[index])
            .attr("d", (d, index, elements) => {
              const w = Math.ceil(getWidthByPercent(width - margin.left, d));
              const sum = yearData.slice(0, index).reduce((acc, curr) => acc + curr, 0);
              const x = Math.ceil(index > 0 ? getWidthByPercent(width - margin.left, sum) : 0);

              if (colors[index].includes("base64")) {
                const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
                foreignObject.setAttributeNS(null, "width", w);
                foreignObject.setAttributeNS(null, "height", barHeight);
                foreignObject.setAttributeNS(null, "x", x);
                foreignObject.setAttributeNS(null, "y", 0);
                const div = document.createElement("div");
                div.style.background = `url(${colors[index]})`;
                div.style.width = "100%";
                div.style.height = "100%";
                foreignObject.appendChild(div);

                elements[index].parentNode.insertBefore(foreignObject, elements[index]);
                elements[index].remove();
              }

              const isFirst = index === 0;
              const isLast = index === elements.length - 1;

              return roundedRect({
                x,
                y: 0,
                w,
                h: barHeight,
                r: 8,
                tl: isFirst,
                bl: isFirst,
                tr: isLast,
                br: isLast,
              });
            });
        }
      }
    },
    [props.data],
  );
  return [ref];
}
