import styled from "styled-components";

export const chartContainer = "chart-container";

export const chartTooltip = "chart-tooltip";

export const chartTooltipYtrasnform = "chart-tooltip-y-transform";

export const tooltipAnimation = `transform 200ms linear`;

export const xAxisClass = "x-axis-container";

export const Container = styled.div.attrs(({ height }) => ({
  style: {
    height,
  },
}))`
  user-select: none;
  background-color: #2c3e4a;

  ${`.${chartTooltip}`} {
    pointer-events: none;
  }

  ${`.${chartContainer}`} path {
    cursor: pointer;
  }
`;
