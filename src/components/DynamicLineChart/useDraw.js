import * as d3 from "d3";
import ru from "date-fns/locale/ru";
import { useCallback } from "react";

export const getShortMonts = () =>
  Array.from({ length: 12 }, (_, monthIndex) => {
    const str = ru.localize.month(monthIndex, { width: "abbreviated" }).substring(0, 3);

    return str.charAt(0).toUpperCase() + str.slice(1);
  });

export function useDraw(props) {
  const ref = useCallback(
    (node) => {
      if (node !== null) {
        const { height, data, colors } = props;
        const width = Math.min(props.width, node.getBoundingClientRect().width);
        const ticksStrokeWith = 1;
        const linesStrokeWith = 1;
        const xScaleHeight = 20;
        const margin = { bottom: 20, top: 20, left: 20, right: 40 };
        const count = data.reduce((acc, { values }) => Math.max(acc, values.length), 0);
        const months = getShortMonts();

        /** SVG **/
        d3.select(node).select("svg").remove();
        const svg = d3.select(node).append("svg").attr("viewBox", `0 0 ${width} ${height}`);

        const yScaleXRange = height - linesStrokeWith - ticksStrokeWith - xScaleHeight - margin.bottom;

        /** Y - axis **/
        const yScale = d3
          .scaleLinear()
          .domain(d3.extent(data.reduce((acc, { values }) => acc.concat(values.map(({ value }) => value)), [])))
          .range([yScaleXRange, margin.top]);

        let yScaleWidth = 0;
        const yScalePadding = 15;

        svg
          .append("g")
          .attr("class", "y axis")
          .attr("font-weight", "bold")
          .attr("color", "#fff")
          .call(
            d3
              .axisLeft(yScale)
              .ticks(6)
              .tickFormat((tick) => `${tick}₽`),
          )
          .call((g) => {
            const texts = g.selectAll(".tick text").nodes();
            for (let i = 0; i < texts.length; i++) {
              yScaleWidth = Math.max(yScaleWidth, texts[i].getBoundingClientRect().width + yScalePadding);
            }

            g.select(".domain").remove();
            g.selectAll("line")
              .attr("stroke", "#3b4852")
              .attr("x1", margin.left + yScaleWidth)
              .attr("stroke-width", ticksStrokeWith)
              .attr("x2", width - margin.right)
              .attr("shape-rendering", "crispEdges");

            g.selectAll("text").attr("transform", `translate(${margin.left + yScaleWidth}, 0)`);
          });

        /** X - axis **/
        const xScale = d3
          .scaleLinear()
          .domain([0, count - 1])
          .range([margin.left + yScaleWidth, Math.round(width - margin.right)]);

        svg
          .append("g")
          .call(
            d3
              .axisBottom(xScale)
              .ticks(24)
              .tickFormat((i) => {
                const date = data[0].values[i].date;
                return months[date.getMonth()];
              }),
          )
          .attr("color", "#c6c6c6")
          .call((g) => {
            g.attr("transform", `translate(${0}, ${yScaleXRange + 10})`);
            g.select(".domain").remove();
            g.selectAll("line").remove();
          });

        for (let i = 0; i < data.length; i++) {
          /** Dataset **/
          const dataset = d3.range(data[i].values.length).map((n) => ({ y: data[i].values[n].value }));
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
            .attr("fill", "none")
            .attr("stroke", colors[i] || colors[0])
            .attr("stroke-width", linesStrokeWith);
        }
      }
    },
    [props.data],
  );
  return [ref];
}
