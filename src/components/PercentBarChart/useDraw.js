import * as d3 from "d3";
import { useCallback } from "react";

export function useDraw(props) {
  const ref = useCallback(
    (node) => {
      if (node !== null) {
        const { labels, colors } = props;
        const data = Array.isArray(props.data[0]) ? props.data : [props.data];
        const width = Math.min(props.width, node.getBoundingClientRect().width);
        const barHeight = 18;
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

        svg
          .append("g")
          .attr("transform", `translate(${margin.left},0)`)
          .attr("fill", "#F4F7F9")
          .selectAll("rect")
          .data(labels)
          .join("rect")
          .attr("rx", 10)
          .attr("ry", 10)
          .attr("height", barHeight)
          .attr("width", width - margin.left)
          .attr("transform", (n, i) => `translate(${0}, ${barHeight * i + (i > 0 ? barPadding * i + 1 : 0)})`);
      }
    },
    [props.data],
  );
  return [ref];
}
