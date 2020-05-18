import * as d3 from "d3";
import { useState, useCallback } from "react";

export function useDraw(props) {
  const [rect, setRect] = useState(null);
  const ref = useCallback(
    (node) => {
      const { width, height, data, labels } = props;
      const ticksStrokeWith = 1;
      const linesStrokeWith = 2;
      const xScaleHeight = 40;

      if (node !== null) {
        /** Dataset **/
        const dataset = d3.range(data.length).map((n) => ({ y: data[n] }));

        /** SVG **/
        d3.select(node).select("svg").remove();
        const svg = d3.select(node).append("svg").attr("viewBox", `0 0 ${width} ${height}`);
        const yScaleXRange = height - linesStrokeWith - ticksStrokeWith - xScaleHeight;

        /** Y - axis **/
        const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d) * 1.24])
          .range([yScaleXRange, 0]);

        svg
          .append("g")
          .attr("class", "y axis")
          .call(d3.axisLeft(yScale).ticks(6))
          .call((g) => {
            g.select(".domain").remove();
            g.selectAll("line")
              .attr("stroke-width", ticksStrokeWith)
              .attr("x2", width)
              .attr("x1", 0)
              .attr("x2", width)
              .attr("shape-rendering", "crispEdges");
          });

        /** X - axis **/
        const xScale = d3
          .scaleLinear()
          .domain([0, data.length - 1])
          .range([0, width]);

        svg
          .append("g")
          .attr("class", "x axis")
          .call(d3.axisBottom(xScale).tickFormat((i) => labels[i]))
          .call((g) => {
            let maxWidth = 0;
            svg
              .select(".y.axis")
              .selectAll("text")
              .each((i, n, elem) => {
                const width = elem[n].getBoundingClientRect().width;
                maxWidth = Math.max(maxWidth, width);
              });
            const yPadding = maxWidth;

            const xAxisWidth = g.node().getBoundingClientRect().width;
            const diff = (xAxisWidth - width + linesStrokeWith * 2) / 2;

            svg.select(".y.axis").attr("transform", `translate(${maxWidth + diff}, 0)`);

            xScale.range([diff + yPadding + diff, width - diff]);
            g.attr("transform", `translate(0, ${height - xScaleHeight + 10})`);
            g.select(".domain").remove();
            g.selectAll("line").remove();
          })
          .selectAll(".tick")
          .data(data)
          .join(".tick")
          .attr("transform", (d, i) => `translate(${xScale(i)}, 0)`);

        /** Path **/
        const line = d3
          .line()
          .x((d, i) => xScale(i))
          .y((d) => yScale(d.y) + ticksStrokeWith)
          .curve(d3.curveMonotoneX);
        svg.append("path").datum(dataset).attr("d", line).attr("stroke-width", linesStrokeWith);

        /** Dots **/
        svg
          .selectAll(".dot")
          .data(dataset)
          .enter()
          .append("circle") // Uses the enter().append() method
          .attr("class", "dot") // Assign a class for styling
          .attr("cx", (d, i) => xScale(i))
          .attr("cy", (d) => yScale(d.y) + ticksStrokeWith)
          .attr("r", 5)
          .on("mousemove", (d, g, e) => {
            console.info("--> mousemove ggwp 4444 event", { d, g, e });
          });

        setRect();
      }
    },
    [props],
  );
  return [rect, ref];
}
