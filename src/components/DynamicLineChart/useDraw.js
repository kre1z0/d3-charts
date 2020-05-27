import * as d3 from "d3";
import { useCallback } from "react";

export function useDraw(props) {
  const ref = useCallback(
    (node) => {
      if (node !== null) {
        const { height, labels, colors } = props;
        const data = Array.isArray(props.data[0]) ? props.data : [props.data];
        const width = Math.min(props.width, node.getBoundingClientRect().width);
        const ticksStrokeWith = 1;
        const linesStrokeWith = 2;
        const xScaleHeight = 20;
        const margin = { bottom: 20, top: 20, left: 20, right: 40 };

        /** SVG **/
        d3.select(node).select("svg").remove();
        const svg = d3.select(node).append("svg").attr("viewBox", `0 0 ${width} ${height}`);

        const yScaleXRange = height - linesStrokeWith - ticksStrokeWith - xScaleHeight - margin.bottom;

        /** Y - axis **/
        const yScale = d3
          .scaleLinear()
          .domain(d3.extent(data.reduce((m, d) => m.concat(d.map((n) => n * 1.24)), [])))
          .range([yScaleXRange, margin.top]);

        let yScaleWidth = 0;
        const yScalePadding = 15;

        svg
          .append("g")
          .attr("class", "y axis")
          .call(d3.axisLeft(yScale).ticks(6))
          .call((g) => {
            const texts = g.selectAll(".tick text").nodes();
            for (let i = 0; i < texts.length; i++) {
              yScaleWidth = Math.max(yScaleWidth, texts[i].getBoundingClientRect().width + yScalePadding);
            }

            g.select(".domain").remove();
            g.selectAll("line")
              .attr("x1", margin.left + yScaleWidth)
              .attr("stroke-width", ticksStrokeWith)
              .attr("x2", width - margin.right)
              .attr("shape-rendering", "crispEdges");

            g.selectAll("text").attr("transform", `translate(${margin.left + yScaleWidth}, 0)`);
          });

        /** X - axis **/
        const xScale = d3
          .scaleLinear()
          .domain([0, labels.length - 1])
          .range([margin.left + yScaleWidth, Math.round(width - margin.right)]);

        svg
          .append("g")
          .call(d3.axisBottom(xScale).tickFormat((i) => labels[i]))
          .call((g) => {
            g.attr("transform", `translate(${0}, ${yScaleXRange})`);
            g.select(".domain").remove();
            g.selectAll("line").remove();
          });

        for (let i = 0; i < data.length; i++) {
          /** Dataset **/
          const dataset = d3.range(data[i].length).map((n) => ({ y: data[i][n] }));
          /** Path **/
          const line = d3
            .line()
            .x((d, i) => xScale(i))
            .y((d) => yScale(d.y) + ticksStrokeWith)
            .curve(d3.curveMonotoneX);

          const globalClass = `line-${i}`;

          svg
            .append("g")
            .attr("class", globalClass)
            .append("path")
            .datum(dataset)
            .attr("d", line)
            .attr("stroke", colors[i])
            .attr("stroke-width", linesStrokeWith);
        }
      }
    },
    [props.data],
  );
  return [ref];
}
