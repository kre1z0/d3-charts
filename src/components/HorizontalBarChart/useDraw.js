import * as d3 from "d3";
import { useCallback } from "react";
import { get, maxBy, range, isUndefined, sumBy, slice } from "lodash";

import { breakWordsByRow } from "helpers/breakWordsByRow";

const formatNumber = (num) => num;

export function useDraw(props) {
  const ref = useCallback(
    (node) => {
      if (node !== null && props.data.length) {
        const { data, colors } = props;
        const width = Math.min(props.width, node.getBoundingClientRect().width);
        /** SVG **/
        const max = get(
          maxBy(data, ({ values }) => values.length),
          "values.length",
        );

        d3.select(node).select("svg").remove();
        const barHeight = 30;
        const margin = { top: 30, right: 80, bottom: 10, left: 200 };
        const height = Math.ceil((data.length + 0.1) * barHeight) + margin.top + margin.bottom;
        const svg = d3.select(node).append("svg").attr("viewBox", [0, 0, width, height]);
        const textPadding = 4;

        const x = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.rating)])
          .range([margin.left, width - margin.right]);

        const y = d3
          .scaleBand()
          .domain(d3.range(data.length))
          .rangeRound([margin.top, height - margin.bottom])
          .padding(0.1);

        const xAxis = (g) =>
          g
            .attr("transform", `translate(0,${margin.top})`)
            .call(
              d3
                .axisTop(x)
                .ticks(Math.floor(width / 80), data.format)
                .tickFormat((v) => (v ? formatNumber(v) : "млн. руб")),
            )
            .call((g) => g.select(".domain").remove());

        const yAxis = (g) =>
          g.attr("transform", `translate(${margin.left},0)`).call(
            d3
              .axisLeft(y)
              .tickFormat((i) => data[i].name)
              .tickSizeOuter(0),
          );
        const items = range(0, max);

        for (let index = 0; index < items.length; index++) {
          svg
            .append("g")
            .attr("fill", colors[index])
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("height", y.bandwidth())
            .each((d, i, elements) => {
              const prevValue = sumBy(slice(d.values, 0, index), "value");
              const value = get(d.values, `[${index}].value`);
              const el = elements[i];
              const node = d3.select(el);

              if (isUndefined(value) || value === 0) {
                node.remove();
              } else {
                node
                  .attr("x", x(prevValue))
                  .attr("y", y(i))
                  .attr("width", x(value) - x(0))
                  .append("title")
                  .text(
                    `${get(d.values, `[${index}].name`)}: ${formatNumber(value)} млн. руб, ${formatNumber(
                      get(d.values, `[${index}].weight_natural`),
                    )} ${get(d.values, `[${index}].unit_natural`)}` || null,
                  );
              }
            });
        }

        svg
          .append("g")
          .attr("fill", "#767373")
          .attr("text-anchor", "start")
          .attr("font-family", "sans-serif")
          .attr("font-size", 12)
          .selectAll("text")
          .data(data)
          .join("text")
          .attr("x", (d) => x(d.rating) + textPadding)
          .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
          .attr("dy", "0.35em")
          .text((d) => formatNumber(d.rating));

        svg.append("g").call(xAxis);

        svg
          .append("g")
          .call(yAxis)
          .call((g) => {
            g.selectAll("g text").each((_, index, elements) => {
              const el = d3.select(elements[index]);
              const text = el.text();

              const words = text.length > 30 ? breakWordsByRow(text).filter((word) => !!word) : [text];

              if (words.length > 1) {
                el.text("");

                for (let i = 0; i < words.length; i++) {
                  const tspan = el.append("tspan").text(words[i]);
                  if (i > 0) {
                    tspan.attr("dy", "1em").attr("x", "-10");
                  } else {
                    tspan.attr("dy", "0").attr("x", "-10");
                  }
                }
              }
            });
          })
          .select(".domain")
          .attr("stroke", "#b7b9bd");
      }
    },
    [props.data],
  );
  return [ref];
}
