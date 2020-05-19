import * as d3 from "d3";
import { useCallback } from "react";

export function useDraw(props) {
  const ref = useCallback(
    (node) => {
      if (node !== null) {
        const { height, labels, colors } = props;

        const data = [
          {
            name: "CA",
            "<10": 5038433,
            "10-19": 5170341,
            "20-29": 5809455,
            "30-39": 5354112,
            "40-49": 5179258,
            "50-59": 5042094,
            "60-69": 3737461,
            "70-79": 2011678,
            "≥80": 1311374,
            total: 38654206,
          },
          {
            name: "TX",
            "<10": 3983091,
            "10-19": 3910528,
            "20-29": 3946447,
            "30-39": 3770534,
            "40-49": 3545746,
            "50-59": 3344930,
            "60-69": 2431494,
            "70-79": 1291486,
            "≥80": 732179,
            total: 26956435,
          },
          {
            name: "FL",
            "<10": 2211012,
            "10-19": 2331102,
            "20-29": 2597830,
            "30-39": 2416176,
            "40-49": 2575576,
            "50-59": 2762983,
            "60-69": 2404659,
            "70-79": 1615547,
            "≥80": 1019566,
            total: 19934451,
          },
          {
            name: "NY",
            "<10": 2319945,
            "10-19": 2445591,
            "20-29": 2894266,
            "30-39": 2605355,
            "40-49": 2617327,
            "50-59": 2755620,
            "60-69": 2095207,
            "70-79": 1160055,
            "≥80": 804091,
            total: 19697457,
          },
        ];

        const width = Math.min(props.width, node.getBoundingClientRect().width);
        const margin = { top: 10, right: 10, bottom: 20, left: 40 };

        const formatValue = (x) => (isNaN(x) ? "N/A" : x.toLocaleString("en"));

        /** SVG **/
        d3.select(node).select("svg").remove();
        const svg = d3.select(node).append("svg").attr("viewBox", [0, 0, width, height]);

        const series = d3
          .stack()
          .keys(["<10", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "≥80"])(data)
          .map((d) => (d.forEach((v) => (v.key = d.key)), d));

        const color = d3
          .scaleOrdinal()
          .domain(series.map((d) => d.key))
          .range(d3.schemeSpectral[series.length])
          .unknown("#ccc");

        const x = d3
          .scaleBand()
          .domain(data.map((d) => d.name))
          .range([margin.left, width - margin.right])
          .padding(0.1);

        const xAxis = (g) =>
          g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .call((g) => g.selectAll(".domain").remove());

        const y = d3
          .scaleLinear()
          .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
          .rangeRound([height - margin.bottom, margin.top]);

        const yAxis = (g) =>
          g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(null, "s"))
            .call((g) => g.selectAll(".domain").remove());

        svg
          .append("g")
          .selectAll("g")
          .data(series)
          .join("g")
          .attr("fill", (d) => color(d.key))
          .selectAll("rect")
          .data((d) => d)
          .join("rect")
          .attr("x", (d, i) => x(d.data.name))
          .attr("y", (d) => y(d[1]))
          .attr("height", (d) => y(d[0]) - y(d[1]))
          .attr("width", x.bandwidth())
          .append("title")
          .text((d) => `${d.data.name} ${d.key} ${formatValue(d.data[d.key])}`);

        svg.append("g").call(xAxis);

        svg.append("g").call(yAxis);
      }
    },
    [props],
  );
  return [ref];
}
