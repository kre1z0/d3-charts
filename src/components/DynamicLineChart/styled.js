import styled from "styled-components";

export const chartContainer = "chart-container";

export const chartTooltip = "chart-tooltip";

export const Container = styled.div.attrs(({ height }) => ({
  style: {
    height,
  },
}))`
  user-select: none;
  background-color: #2c3e4a;
  ${`.${chartContainer}`} path {
    cursor: pointer;
  }

  ${`.${chartTooltip}`} {
    transition: transform 200ms cubic-bezier(0.3, 0, 0.7, 0.1);
  }
`;
