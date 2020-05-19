import * as d3 from "d3";
import { useCallback } from "react";

function stackMin(serie) {
  return d3.min(serie, (d) => d[0]);
}

function stackMax(serie) {
  return d3.max(serie, (d) => d[1]);
}

export function useDraw(props) {
  const ref = useCallback(
    (node) => {
      if (node !== null) {
        const { data, height, labels, colors } = props;
        const width = Math.min(props.width, node.getBoundingClientRect().width);
        /** SVG **/
        d3.select(node).select("svg").remove();

        const series = d3.stack().keys(["apples", "bananas", "cherries", "dates"]).offset(d3.stackOffsetDiverging)(
          data,
        );

        const svg = d3.select(node).append("svg").attr("viewBox", [0, 0, width, height]);
        const margin = { top: 20, right: 30, bottom: 30, left: 60 };

        const x = d3
          .scaleBand()
          .domain(data.map((d) => d.name))
          .rangeRound([margin.left, width - margin.right])
          .padding(0.1);

        const y = d3
          .scaleLinear()
          .domain([d3.min(series, stackMin), d3.max(series, stackMax)])
          .rangeRound([height - margin.bottom, margin.top]);

        svg
          .append("g")
          .attr("transform", "translate(0," + y(d3.min(series, stackMin)) + ")")
          .call(d3.axisBottom(x))
          .selectAll("line, .domain")
          .remove();

        svg
          .append("g")
          .attr("transform", "translate(" + margin.left + ",0)")
          .call(d3.axisLeft(y).tickFormat((d) => `${d}%`))
          .call((g) => {
            g.selectAll(".domain").remove();
            g.selectAll("line")
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
          .attr("stroke", "black")
          .attr("x2", width)
          .attr("x1", 0)
          .attr("x2", width)
          .attr("shape-rendering", "crispEdges");
      }
    },
    [props],
  );
  return [ref];
}
