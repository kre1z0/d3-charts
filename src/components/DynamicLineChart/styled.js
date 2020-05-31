import styled from "styled-components";

export const chartContainer = "chart-container";

export const chartTooltip = "chart-tooltip";

export const chartTooltipYtrasnform = "chart-tooltip-y-transform";

const tooltipAnimation = `transform 200ms linear`;

export const Container = styled.div.attrs(({ height }) => ({
  style: {
    height,
  },
}))`
  user-select: none;
  background-color: #2c3e4a;
  ${`.${chartContainer}`} path {
    pointer-events: stroke;
  }

  ${`.${chartTooltip}`} {
    pointer-events: none;
    transition: ${tooltipAnimation};
  }

  ${`.${chartTooltipYtrasnform}`} {
    transition: ${tooltipAnimation};
  }
`;
