import styled from "styled-components";

export const chartContainer = "chart-container";

export const chartTooltip = "chart-tooltip";

export const chartTooltipYtrasnform = "chart-tooltip-y-transform";

export const tooltipAnimation = `transform 200ms linear`;

export const xAxisClass = "x-axis-container";

export const tickContainerClass = "tick-y-axis-container";

export const yAxisClass = "y-axis-container";

export const Container = styled.div.attrs(({ height }) => ({
  style: {
    height,
  },
}))`
  user-select: none;
  background-color: rgba(38, 53, 64, 1);

  ${`.${chartTooltip}`} {
    pointer-events: none;
  }

  ${`.${chartContainer}`} path {
    cursor: pointer;
  }
`;
