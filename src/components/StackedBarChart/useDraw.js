import * as d3 from "d3";
import { useCallback } from "react";

import { wrapByWidth } from "helpers/wrapByWidth";
import { stackMin, stackMax } from "helpers/stack";

export function useDraw(props) {
  const ref = useCallback(
    (node) => {
      if (node !== null && props.data.length) {
        const { data, height, colors } = props;
        const width = Math.min(props.width, node.getBoundingClientRect().width);
        /** SVG **/
        d3.select(node).select("svg").remove();
        const keys = Object.keys(data[0]).slice(1);

        const series = d3.stack().keys(keys).offset(d3.stackOffsetDiverging)(data);

        const svg = d3.select(node).append("svg").attr("viewBox", [0, 0, width, height]);
        const margin = { top: 20, right: 0, bottom: 30, left: 60 };

        const x = d3
          .scaleBand()
          .domain(data.map((d) => d.name))
          .rangeRound([0, width - 20])
          .padding(0.75)
          .paddingOuter(0.45);

        const y = d3
          .scaleLinear()
          .domain([d3.min(series, stackMin), d3.max(series, stackMax)])
          .rangeRound([height - margin.bottom, margin.top]);

        svg
          .append("g")
          .attr("transform", `translate(${margin.left - 20}, ${y(d3.min(series, stackMin))})`)
          .call(d3.axisBottom(x))
          .call((g) => {
            g.selectAll("line, .domain").remove();
            g.selectAll(".tick text").call(wrapByWidth, 80);
          });

        svg
          .append("g")
          .attr("transform", `translate(${margin.left},0)`)
          .call(
            d3
              .axisLeft(y)
              .ticks(8)
              .tickFormat((d) => `${d}%`),
          )
          .call((g) => {
            g.selectAll(".domain").remove();
            g.selectAll("line")
              .attr("stroke", "#F4F5F5")
              .attr("stroke-width", 1)
              .attr("x2", width)
              .attr("x1", 0)
              .attr("x2", width)
              .attr("shape-rendering", "crispEdges")
              .each((d, i, elements) => {
                if (d === 0) {
                  elements[i].remove();
                }
              });
          });

        svg
          .append("g")
          .attr("class", "bar-container")
          .attr("transform", `translate(${margin.left - 20},0)`)
          .selectAll("g")
          .data(series)
          .enter()
          .append("g")
          .attr("fill", (d, i) => colors[i])
          .selectAll("rect")
          .data((d) => d)
          .enter()
          .append("rect")
          .attr("width", x.bandwidth)
          .attr("x", (d) => x(d.data.name))
          .attr("y", (d) => y(d[1]))
          .attr("height", (d) => y(d[0]) - y(d[1]));

        svg
          .append("line")
          .attr("transform", `translate(${margin.left},${y(0)})`)
          .attr("class", "zero-tick")
          .attr("stroke-width", 1)
          .attr("stroke", "#94A0A5")
          .attr("x2", width)
          .attr("x1", 0)
          .attr("x2", width)
          .attr("shape-rendering", "crispEdges");
      }
    },
    [props.data],
  );
  return [ref];
}
