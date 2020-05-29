import * as d3 from "d3";
import ru from "date-fns/locale/ru";
import eachMonthOfInterval from "date-fns/eachMonthOfInterval";
import closestTo from "date-fns/closestTo";
import { useCallback, useRef, useEffect, useState } from "react";

import { getPosition, detectMob, useThrottle, animate } from "./helpers";
import { chartContainer } from "./styled";

export const getShortMonts = () =>
  Array.from({ length: 12 }, (_, monthIndex) => {
    const str = ru.localize.month(monthIndex, { width: "abbreviated" }).substring(0, 3);

    return str.charAt(0).toUpperCase() + str.slice(1);
  });

export function useDraw(props) {
  const [innerWidth, updateState] = useState(window.innerWidth);
  const forceUpdate = useCallback(() => updateState(window.innerWidth), []);
  const dragStartX = useRef(0);
  const dragEndX = useRef(0);
  const dragPositionX = useRef(null);
  const currentX = useRef(0);
  const timestamp = useRef(0);
  const speed = useRef(0);

  useEffect(() => {
    dragPositionX.current = null;
    currentX.current = 0;
    dragEndX.current = 0;
  }, [props.data]);

  const throttledResize = useThrottle(forceUpdate, 40);

  useEffect(() => {
    window.addEventListener("resize", throttledResize);
    return () => window.removeEventListener("resize", throttledResize);
  }, []);

  const ref = useCallback(
    (node) => {
      if (node !== null && Array.isArray(props.data) && props.data.length) {
        const { height, data, colors, start, end } = props;
        const dayWidthPx = 4;
        const isMobile = detectMob();

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

        const width = Math.min(innerWidth, node.getBoundingClientRect().width);
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

        const rect = yAxis
          .append("rect")
          .attr("height", height)
          .attr("width", width)
          .attr("x", 0)
          .attr("y", 0)
          .style("cursor", "grab")
          .attr("fill", "rgba(0, 0, 0, 0)");

        const onEnd = () => {
          chart.attr("class", chartContainer);
          body.style("cursor", null);

          if (isMobile) {
            body.style("overflow", null);
          }

          rect.style("cursor", "grab");
          dragStartX.current = 0;
          dragPositionX.current = dragEndX.current;
          currentX.current = 0;
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("touchmove", onMove);
          document.removeEventListener("mouseup", onEnd);
          document.removeEventListener("touchend", onEnd);

          const dt = Date.now() - timestamp.current;

          if (dt < 44) {
            console.info("--> ggwp 4444 ANIMATE");
            animate({
              duration: 400,
              timing: (t) => t * (2 - t),
              draw: (progress) => {
                const px = Math.round(speed.current * 2 * progress);
                const currX = dragPositionX.current - px;
                const transX = Math.max(Math.min(currX, transformX), 0);

                if (dragEndX.current !== transX) {
                  xAxis.attr("transform", `translate(-${transX}, ${xAxisPosition})`);
                  chart.attr("transform", `translate(-${transX}, 0)`);
                }

                if (progress === 1) {
                  speed.current = 0;
                  timestamp.current = 0;
                  dragPositionX.current = transX;
                }
              },
            });
          }
        };

        const onMove = (event) => {
          const { x } = getPosition(event);

          const left = currentX.current < x;
          const right = currentX.current > x;
          const currX = dragPositionX.current - (x - dragStartX.current);
          const transX = Math.max(Math.min(currX, transformX), 0);

          if (dragEndX.current !== transX) {
            xAxis.attr("transform", `translate(-${transX}, ${xAxisPosition})`);
            chart.attr("transform", `translate(-${transX}, 0)`);
            dragEndX.current = transX;
          }

          const restartR = currX > transformX && left && currentX.current !== 0;

          const restartL = currX < 0 && right && currentX.current !== 0;

          if (restartR) {
            dragStartX.current = x;
          } else if (restartL) {
            dragStartX.current = x;
          }

          if (currentX.current) {
            const now = Date.now();
            const dt = now - timestamp.current;
            const dx = x - currentX.current;
            const speedX = Math.round((dx / dt) * 100);
            speed.current = speedX;
            timestamp.current = now;
          }

          currentX.current = x;
        };

        const onStart = () => {
          const { x } = getPosition(d3.event);
          dragStartX.current = x;
          chart.attr("class", null);

          if (dragPositionX.current === null) {
            dragPositionX.current = transformX;
          }

          body.style("cursor", "grabbing");
          if (isMobile) {
            body.style("overflow", "hidden");
          }

          rect.style("cursor", null);

          document.addEventListener("mousemove", onMove);
          document.addEventListener("touchmove", onMove);
          document.addEventListener("mouseup", onEnd);
          document.addEventListener("touchend", onEnd);
        };

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
            .attr("stroke-width", linesStrokeWith)
            .on("mousedown touchstart", onStart);
        }

        rect.on("mousedown touchstart", onStart);
      }
    },
    [props.data, innerWidth],
  );
  return [ref];
}
