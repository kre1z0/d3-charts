import * as d3 from "d3";
import { useState, useCallback } from "react";

export function useDraw(props) {
  const [rect, setRect] = useState(null);
  const ref = useCallback(
    (node) => {
      const { width, height } = props;

      if (node !== null) {
        const margin = { top: 0, right: 40, bottom: 20, left: 40 };
        const widthValue = width - margin.left - margin.right;
        const heightValue = height - margin.top - margin.bottom;

        // The number of datapoints
        const data = [200, 224, 380, 198, 255, 100, 250, 234, 210];
        const dates = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018];

        // 5. X scale will use the index of our data
        const xScale = d3
          .scaleLinear()
          .domain([0, data.length - 1])
          .range([0, widthValue]);

        const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d) * 1.14])
          .range([heightValue, 0]);

        const line = d3
          .line()
          .x((d, i) => xScale(i)) // set the x values for the line generator
          .y((d) => yScale(d.y)) // set the y values for the line generator
          .curve(d3.curveMonotoneX); // apply smoothing to the line

        // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
        const dataset = d3.range(data.length).map((n) => ({ y: data[n] }));

        // 1. Add the SVG to the page and employ #2
        const svg = d3
          .select(node)
          .append("svg")
          .attr("viewBox", `0 0 ${width} ${height}`)
          .append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // 3. Call the x axis in a group tag
        svg
          .append("g")
          .attr("class", "x axis")
          .attr("transform", `translate(0, ${heightValue})`)
          .call(d3.axisBottom(xScale).tickFormat((i) => dates[i]))
          .call((g) => {
            g.select(".domain").remove();
            g.selectAll("line").remove();
          });

        // 4. Call the y axis in a group tag
        svg
          .append("g")
          .attr("class", "y axis")
          .call(d3.axisLeft(yScale).ticks(6))
          .call((g) => {
            g.select(".domain").remove();
            g.selectAll("line")
              .attr("x2", widthValue)
              .attr("x1", 5)
              .attr("x2", widthValue)
              .attr("shape-rendering", "crispEdges");
          });

        // 9. Append the path, bind the data, and call the line generator
        svg
          .append("path")
          .datum(dataset) // 10. Binds data to the line
          .attr("class", "line") // Assign a class for styling
          .attr("d", line);

        // 12. Appends a circle for each datapoint
        svg
          .selectAll(".dot")
          .data(dataset)
          .enter()
          .append("circle") // Uses the enter().append() method
          .attr("class", "dot") // Assign a class for styling
          .attr("cx", (d, i) => xScale(i))
          .attr("cy", (d) => yScale(d.y))
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
