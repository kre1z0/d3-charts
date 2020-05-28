import * as d3 from "d3";
import { event as currentEvent } from "d3";
import ru from "date-fns/locale/ru";
import eachMonthOfInterval from "date-fns/eachMonthOfInterval";
import isFirstDayOfMonth from "date-fns/isFirstDayOfMonth";
import differenceInDays from "date-fns/differenceInDays";
import closestTo from "date-fns/closestTo";
import { useCallback, useRef } from "react";

import { getPosition, rateLimit } from "./helpers";
import { chartContainer } from "./styled";

export const getShortMonts = () =>
  Array.from({ length: 12 }, (_, monthIndex) => {
    const str = ru.localize.month(monthIndex, { width: "abbreviated" }).substring(0, 3);

    return str.charAt(0).toUpperCase() + str.slice(1);
  });

export function useDraw(props) {
  const dragStartX = useRef(0);
  const dragEndX = useRef(0);
  const dragPositionX = useRef(null);
  const currentX = useRef(0);

  const ref = useCallback(
    (node) => {
      if (node !== null && Array.isArray(props.data) && props.data.length) {
        console.info("--> ggwp 4444 render");
        const { height, data, colors, start, end } = props;
        const dayWidthPx = 4;

        const months = eachMonthOfInterval({ start, end });
        const indexMaxCount = data.reduce((acc, { values }, index) => (acc > values.length ? acc : index), 0);
        const itemMaxLength = data[indexMaxCount];
        const dates = itemMaxLength.values.map(({ date }) => date);

        const vertexIndices = (+end !== +months[months.length - 1] ? [...months, end] : months).map(
          (month, i, array) => {
            const closestDate = i !== array.length - 1 ? closestTo(month, dates) : end;
            const index = itemMaxLength.values.findIndex(({ date }) => +date === +closestDate);
            return index;
          },
        );

        const width = Math.min(props.width, node.getBoundingClientRect().width);
        const ticksStrokeWith = 1;
        const linesStrokeWith = 1;
        const xScaleHeight = 20;
        const margin = { bottom: 20, top: 20, left: 20, right: 40 };
        const shortMonths = getShortMonts();
        const xLabelMinWidth = 30;

        /** SVG **/
        const body = d3.select("body");
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

        const yAxis = svg
          .append("g")
          .attr("font-weight", "bold")
          .attr("color", "#fff")
          .call(
            d3
              .axisLeft(yScale)
              .ticks(4)
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

        const getX = (index) => {
          const left = margin.left + yScaleWidth;
          return index > 0 ? vertexIndices[index] * dayWidthPx + left : left;
        };

        const paddings = width - margin.left - margin.right - yScaleWidth;
        const defaultTranslate = (itemMaxLength.values.length - 1) * dayWidthPx;
        const transformX = Math.ceil(defaultTranslate - paddings);
        const chart = svg.append("g").attr("class", chartContainer).attr("transform", `translate(-${transformX}, 0)`);

        const xAxisPosition = yScaleXRange + yScalePadding;
        const xAxis = svg
          .append("g")
          .attr("color", "#c6c6c6")
          .attr("transform", `translate(-${transformX}, ${xAxisPosition})`)
          .attr("text-anchor", "middle")
          .attr("font-size", 10)
          .attr("font-family", "sans-serif");

        for (let i = 0; i < vertexIndices.length; i++) {
          const skipLabel = i === 0 && vertexIndices[i + 1] * dayWidthPx < xLabelMinWidth;

          if (months[i] && !skipLabel) {
            const monthShort = shortMonths[months[i].getMonth()];
            xAxis
              .append("g")
              .attr("transform", `translate(${getX(i)}, 0)`)
              .append("text")
              .attr("fill", "currentColor")
              .text(monthShort);
          }
        }

        for (let i = 0; i < data.length; i++) {
          /** Dataset **/
          const item = data[i];

          const dataset = d3.range(vertexIndices.length).map((n) => {
            return { y: item.values[vertexIndices[n]].value };
          });

          /** Path **/
          const line = d3
            .line()
            .x((d, i) => getX(i))
            .y((d) => yScale(d.y) + ticksStrokeWith)
            .curve(d3.curveMonotoneX);

          chart
            .append("path")
            .datum(dataset)
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", colors[i] || colors[0])
            .attr("stroke-width", linesStrokeWith);
        }

        const rect = yAxis
          .append("rect")
          .attr("height", height)
          .attr("width", width)
          .attr("x", 0)
          .attr("y", 0)
          .style("cursor", "grab")
          .attr("fill", "green");

        const onMove = (event) => {
          const { x } = getPosition(event);

          const currX = dragPositionX.current - (x - dragStartX.current);
          const transX = Math.max(Math.min(currX, transformX), 0);

          if (dragEndX.current !== transX) {
            xAxis.attr("transform", `translate(-${transX}, ${xAxisPosition})`);
            chart.attr("transform", `translate(-${transX}, 0)`);
            dragEndX.current = transX;
          }

          const right = currentX.current > x;
          const left = currentX.current < x;

          const outOfTheArea = (currX > transformX && right) || (currX < 0 && left);

          if (outOfTheArea) {
            // dragStartX.current = x;
            console.info("--> ggwp 4444 OUT", x);
          }

          currentX.current = x;
        };

        const onEnd = () => {
          body.style("cursor", null);
          rect.style("cursor", "grab");
          dragStartX.current = 0;
          dragPositionX.current = dragEndX.current;
          currentX.current = 0;
          document.removeEventListener("mousemove", onMove);
        };

        rect.on("mousedown touchstart", () => {
          const { x } = getPosition(currentEvent);
          dragStartX.current = x;

          if (dragPositionX.current === null) {
            dragPositionX.current = transformX;
          }

          body.style("cursor", "grabbing");
          rect.style("cursor", null);

          document.addEventListener("mousemove", onMove);
        });

        document.addEventListener("mouseup", onEnd);
        document.addEventListener("touchend", onEnd);
      }
    },
    [props.data],
  );
  return [ref];
}
