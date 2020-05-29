import styled from "styled-components";

export const chartContainer = "chart-container";

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
`;
