import styled from "styled-components";

export const Container = styled.div.attrs(({ width, height }) => ({
  style: {
    maxWidth: width,
    height,
  },
}))`
  background-color: #2c3e4a;
  .tick line {
    stroke: #c6c6c6;
  }

  path {
    fill: none;
  }

  .dot {
    fill: transparent;
  }

  text,
  .tick {
    color: #c6c6c6;
  }

  .focus circle {
    fill: none;
  }
`;
