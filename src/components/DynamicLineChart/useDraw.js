import * as d3 from "d3";
import eachMonthOfInterval from "date-fns/eachMonthOfInterval";
import closestTo from "date-fns/closestTo";
import format from "date-fns/format";
import isFirstDayOfMonth from "date-fns/isFirstDayOfMonth";
import isLastDayOfMonth from "date-fns/isLastDayOfMonth";
import { useCallback, useRef, useEffect, useState } from "react";

import { getPosition, detectMob, animate, easeOutQuad, getShortMonts, getTranslate } from "./helpers";
import { chartContainer, chartTooltip, chartTooltipYtrasnform, tooltipAnimation, xAxisClass } from "./styled";

const dayPx = {
  months: 4,
  days: 100,
};

export function useDraw(props) {
  const [container, onSetNode] = useState({});
  const dragStartX = useRef(null);
  const dragPositionX = useRef(null);
  const currentX = useRef(0);
  const timestamp = useRef(null);
  const speed = useRef(null);
  const animation = useRef(null);
  const prevPath = useRef(null);
  const tooltip = useRef({});

  useEffect(() => {
    cancelAnimationFrame(animation.current);
    dragPositionX.current = null;
    currentX.current = 0;
    animation.current = null;
    prevPath.current = null;
    tooltip.current = {};
  }, [props.data, props.dimension]);

  const ref = useCallback(
    (node) => {
      if (node !== null && Array.isArray(props.data) && props.data.length) {
        const { height, data, colors, start, end, prefix, margin, dimension } = props;
        const dayWidthPx = dayPx[dimension];
        const tooltipHeight = 20;
        const tooltipMargin = 5;
        const isMobile = detectMob();
        const width = Math.min(window.innerWidth, node.getBoundingClientRect().width);
        const ticksStrokeWith = 1;
        const linesStrokeWith = 1;
        const interactiveLinesStrokeWith = 4;
        const xScaleHeight = 20;
        const shortMonths = getShortMonts();
        const shortMonthsLower = getShortMonts(true);
        const xLabelMinWidth = 30;
        const isDays = dimension === "days";
        const isMonths = dimension === "months";

        const indexMaxCount = data.reduce((acc, { values }, index) => (acc > values.length ? acc : index), 0);
        const itemMaxLength = data[indexMaxCount];
        const dates = itemMaxLength.values.map(({ date }) => date);
        const intervals = eachMonthOfInterval({ start, end });

        const vertexIndices = (+end !== +intervals[intervals.length - 1] ? [...intervals, end] : intervals).map(
          (interval, i, array) => {
            const closestDate = i !== array.length - 1 ? closestTo(interval, dates) : end;
            const index = itemMaxLength.values.findIndex(({ date }) => +date === +closestDate);
            return index;
          },
        );

        /** SVG **/
        const body = d3.select("body");
        d3.select(node).select("svg").remove();
        const svg = d3.select(node).append("svg").attr("viewBox", `0 0 ${width} ${height}`);

        const yScaleXRange = height - linesStrokeWith - ticksStrokeWith - xScaleHeight - margin.bottom;

        /** Y - axis **/
        const yScale = d3
          .scaleLinear()
          .domain(d3.extent(data.reduce((acc, { values }) => acc.concat(values.map(({ value }) => value)), [])))
          .range([yScaleXRange, margin.top])
          .nice();

        let yScaleWidth = 0;
        const yScalePadding = 15;
        let hoverLineY1 = 0;
        let hoverLineY2 = 0;

        const yAxis = svg
          .append("g")
          .attr("font-weight", "bold")
          .attr("color", "#fff")
          .call(
            d3
              .axisLeft(yScale)
              .ticks(6)
              .tickFormat((tick, index, ticks) => {
                if (index === 0) {
                  hoverLineY1 = yScale(tick);
                }
                if (ticks.length - 1 === index) {
                  hoverLineY2 = yScale(tick);
                }

                return `${tick}${prefix}`;
              }),
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
          return index > 0 ? (isDays ? index : vertexIndices[index]) * dayWidthPx + left : left;
        };

        const getMaxTranslateX = () => {
          const width = Math.min(window.innerWidth, node.getBoundingClientRect().width);
          const paddings = width - margin.left - margin.right - yScaleWidth;
          const defaultTranslate = (itemMaxLength.values.length - 1) * dayWidthPx;

          return Math.ceil(defaultTranslate - paddings);
        };

        const translateX = getMaxTranslateX();

        const chart = svg
          .append("g")
          .attr("class", chartContainer)
          .attr("transform", `translate(-${translateX}, 0)`)
          .style("cursor", "pointer");

        const xAxisPosition = yScaleXRange + yScalePadding;
        const xAxis = svg
          .append("g")
          .attr("class", xAxisClass)
          .attr("color", "#c6c6c6")
          .attr("transform", `translate(-${translateX}, ${xAxisPosition})`)
          .attr("text-anchor", "middle")
          .attr("font-size", 10)
          .attr("font-family", "sans-serif")
          .style("pointer-events", "none");

        for (let i = 0; i < (isMonths ? vertexIndices : dates).length; i++) {
          const date = isMonths ? intervals[i] : dates[i];
          const skipLabel = i === 0 && vertexIndices[i + 1] * dayWidthPx < xLabelMinWidth;

          if ((date && !skipLabel) || isDays) {
            const month = date.getMonth();
            const canYear = isMonths
              ? month === 0 || month === 11
              : (isFirstDayOfMonth(date) || isLastDayOfMonth(date)) && (month === 0 || month === 11);

            const monthShort = shortMonths[month];

            const label = isMonths ? monthShort : `${date.getDate()} ${shortMonthsLower[month]}`;

            const xAxisG = xAxis.append("g").attr("transform", `translate(${getX(i)}, 10)`);
            const text = xAxisG.append("text").attr("fill", "currentColor").text(label).attr("font-size", 12);

            if (canYear) {
              const textHeight = text.node().getBoundingClientRect().height;
              const paddingX = 6;
              const paddingY = 2;

              const rect = xAxisG
                .insert("rect", "text")
                .attr("height", textHeight + paddingY * 2)
                .attr("fill", "#697b88")
                .attr("y", -textHeight + paddingY / 2)
                .attr("rx", 10)
                .attr("ry", 10);

              const tspan = text
                .append("tspan")
                .text(date.getFullYear())
                .attr("font-weight", "bold")
                .attr("color", "#fff")
                .attr("font-size", 8)
                .attr("dx", 5 + paddingX);

              const tspanWidth = tspan.node().getComputedTextLength();
              const textWidth = text.node().getBoundingClientRect().width;

              rect
                .attr("width", tspanWidth + paddingX * 2)
                .attr("x", -textWidth / 2 + (textWidth - tspanWidth - paddingX));
            }
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
          const translateX = getTranslate(chart);
          const maxTranslateX = getMaxTranslateX();
          chart.style("cursor", "pointer");
          body.style("cursor", null);

          if (isMobile) {
            body.style("overflow", null);
          }

          rect.style("cursor", "grab");
          dragStartX.current = 0;

          dragPositionX.current = getTranslate(chart);

          currentX.current = 0;
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("touchmove", onMove);
          document.removeEventListener("mouseup", onEnd);
          document.removeEventListener("touchend", onEnd);

          const dt = Date.now() - timestamp.current;

          if (dt < 44) {
            animate({
              duration: 2000,
              timing: easeOutQuad,
              draw: (progress, requestId) => {
                animation.current = requestId;
                const px = Math.round(speed.current * 2 * progress);
                const currX = dragPositionX.current - px;
                const transX = Math.max(Math.min(currX, maxTranslateX), 0);

                if (translateX !== transX) {
                  xAxis.attr("transform", `translate(-${transX}, ${xAxisPosition})`);
                  chart.attr("transform", `translate(-${transX}, 0)`);
                }

                if (progress === 1) {
                  chart.style("pointer-events", null);
                  speed.current = 0;
                  timestamp.current = 0;
                  dragPositionX.current = transX;
                }
              },
            });
          } else {
            chart.style("pointer-events", null);
          }
        };

        const onMove = (event) => {
          chart.style("pointer-events", "none");
          const translateX = getTranslate(chart);
          const { x } = getPosition(event);
          const maxTranslateX = getMaxTranslateX();

          const left = currentX.current < x;
          const right = currentX.current > x;
          const currX = dragPositionX.current - (x - dragStartX.current);
          const transX = Math.max(Math.min(currX, maxTranslateX), 0);

          if (translateX !== transX) {
            xAxis.attr("transform", `translate(-${transX}, ${xAxisPosition})`);
            chart.attr("transform", `translate(-${transX}, 0)`);
          }

          const restartR = currX > maxTranslateX && left && currentX.current !== 0;

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
          if (animation.current) {
            speed.current = 0;
            timestamp.current = 0;
            cancelAnimationFrame(animation.current);
            dragPositionX.current = getTranslate(chart);
          }

          const { x } = getPosition(d3.event);
          dragStartX.current = x;
          chart.style("cursor", null);

          if (dragPositionX.current === null) {
            dragPositionX.current = getTranslate(chart);
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

          const dataset = isMonths
            ? d3.range(vertexIndices.length).map((n) => ({ y: item.values[vertexIndices[n]].value }))
            : d3.range(itemMaxLength.values.length).map((_, index) => ({ y: item.values[index].value }));

          /** Path **/
          const line = d3
            .line()
            .x((d, i) => getX(i))
            .y((d) => yScale(d.y) + ticksStrokeWith)
            .curve(d3.curveCatmullRom);

          const path = chart
            .append("path")
            .datum(dataset)
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", colors[i] || colors[0])
            .attr("stroke-width", linesStrokeWith);

          /** Interactive path **/
          const interactive = path
            .clone()
            .attr("stroke", "transparent")
            .attr("stroke-width", interactiveLinesStrokeWith);

          const chartWidth = chart.node().getBoundingClientRect().width;

          interactive
            .on("mousedown touchstart", onStart)
            .on("mousemove", () => {
              const translateX = getTranslate(chart);
              const { x } = getPosition(d3.event);
              const currX = translateX + x;

              if (!tooltip.current.container) {
                tooltip.current.container = chart.append("g").attr("class", chartTooltip);

                tooltip.current.line = tooltip.current.container
                  .append("line")
                  .attr("y1", hoverLineY1)
                  .attr("y2", hoverLineY2)
                  .style("pointer-events", "none")
                  .attr("stroke", "#a5aead")
                  .attr("shape-rendering", "crispEdges");

                tooltip.current.tooltip = tooltip.current.container
                  .append("g")
                  .attr("class", chartTooltipYtrasnform)
                  .attr("stroke", "none");

                tooltip.current.rect = tooltip.current.tooltip
                  .append("rect")
                  .attr("height", tooltipHeight)
                  .attr("rx", 4)
                  .attr("ry", 4)
                  .attr("fill", "#000");

                tooltip.current.text = tooltip.current.tooltip
                  .append("text")
                  .attr("alignment-baseline", "central")
                  .attr("font-size", 12)
                  .attr("fill", "#fff")
                  .attr("color", "#fff")
                  .attr("font-family", "sans-serif");

                tooltip.current.circle = tooltip.current.tooltip
                  .append("circle")
                  .attr("cx", 10 + tooltipMargin)
                  .attr("r", 3)
                  .attr("fill", "#60c1dc");
              } else {
                tooltip.current.container.style("transition", tooltipAnimation);
                tooltip.current.tooltip.style("transition", tooltipAnimation);
              }

              const index = Math.round((currX - margin.left - yScaleWidth) / dayWidthPx);
              const { value, date } = item.values[index];
              const y = yScale(value);

              const text = tooltip.current.text
                .text(`${value}${prefix}, ${format(date, "d")}д`)
                .attr("transform", `translate(${tooltipMargin * 2 + 10 + 4}, ${0})`);

              if (currX !== getTranslate(tooltip.current.container)) {
                tooltip.current.container.attr("transform", `translate(${currX}, 0)`);
              }

              const rectWidth = text.node().getBoundingClientRect().width + 4 + tooltipMargin * 4;

              tooltip.current.rect
                .attr("width", rectWidth)
                .attr("transform", `translate(${tooltipMargin}, ${-tooltipHeight / 2})`);

              const tX = Math.round(currX - margin.left - yScaleWidth - margin.right + tooltipMargin * 2);
              const tDiff = tX + rectWidth - chartWidth;
              const tooltipTranslateX = tDiff > 0 ? -tDiff : 0;

              tooltip.current.tooltip.attr("transform", `translate(${tooltipTranslateX}, ${y})`);
            })
            .on("click", () => {
              const target = path;
              if (prevPath.current && prevPath.current !== target) {
                prevPath.current.attr("stroke", colors[i] || colors[0]);
                prevPath.current.attr("stroke-width", 1);
              }

              if (prevPath.current !== target) {
                target.attr("stroke", "#60c1dc");
                target.attr("stroke-width", 2);
              }
              prevPath.current = target;
            });
        }

        onSetNode({ node, xAxisPosition, getMaxTranslateX });
        rect.on("mousedown touchstart", onStart);
      }
    },
    [props.data, props.dimension],
  );

  return [ref, container];
}
