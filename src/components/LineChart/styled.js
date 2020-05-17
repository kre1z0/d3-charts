import styled from "styled-components";

export const Container = styled.div`
  max-width: 800px;
  height: 300px;
  line {
    stroke-width: 2;
    stroke: #00ff57;
  }

  path {
    stroke-width: 2;
    fill: none;
    stroke: #ffab00;
  }

  .dot {
    fill: #ffab00;
    stroke: #fff;
  }

  .focus circle {
    fill: none;
    stroke: steelblue;
  }
`;
