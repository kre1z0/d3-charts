import styled from "styled-components";

export const Container = styled.div.attrs(({ width, height }) => ({
  style: {
    maxWidth: width,
    height,
  },
}))`
  line {
    stroke: #c6c6c6;
  }

  path {
    fill: none;
  }

  .dot {
    fill: transparent;
  }

  text {
    color: #c6c6c6;
  }

  .focus circle {
    fill: none;
  }
`;
