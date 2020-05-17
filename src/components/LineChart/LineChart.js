import React, { Component, createRef } from "react";
import * as d3 from "d3";
import { hot } from "react-hot-loader/root";

import { Container } from "./styled";

class LineChartD3Base extends Component {
  container = createRef();

  componentDidMount() {
    this.draw();
  }

  draw = () => {
    // 2. Use the margin convention practice
    var margin = { top: 50, right: 50, bottom: 50, left: 90 },
      width = 800 - margin.left - margin.right, // Use the window's width
      height = 300 - margin.top - margin.bottom; // Use the window's height

    // The number of datapoints
    const data = [200, 224, 380, 198, 255, 100, 250, 234, 210, 222];
    const dates = [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013];

    // 5. X scale will use the index of our data
    const xScale = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([0, width]);

    const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d) * 1.24])
    .range([height, 0]);

    const line = d3
    .line()
    .x((d, i) => xScale(i)) // set the x values for the line generator
    .y((d) => yScale(d.y)) // set the y values for the line generator
    .curve(d3.curveMonotoneX); // apply smoothing to the line

    // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    const dataset = d3.range(data.length).map((n) => ({ y: data[n] }));

    // 1. Add the SVG to the page and employ #2
    const svg = d3
    .select(this.container.current)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 3. Call the x axis in a group tag
    svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickFormat((i) => dates[i]))
    .call((g) => {
      g.select(".domain").remove();
      g.selectAll("line").remove();
    });

    // 4. Call the y axis in a group tag
    svg
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(-40, 0)")
    .call(d3.axisLeft(yScale).ticks(6))
    .call((g) => {
      g.select(".domain").remove();
      g.selectAll("line")
      .attr("stroke", "green")
      .attr("x2", 800)
      .attr("x1", 5)
      .attr("x2", 800)
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

    // overlay todo ggwp
    // svg.append("rect").attr("class", "overlay").attr("width", width).attr("height", height);
  };

  render() {
    return (
      <Container ref={this.container} />
    );
  }
}

export const LineChartD3 = hot(LineChartD3Base);
