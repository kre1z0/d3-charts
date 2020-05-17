import styled from "styled-components";

export const Container = styled.div`
  .line {
    fill: none;
    stroke: #ffab00;
    stroke-width: 2;
  }

  .overlay {
    fill: none;
    pointer-events: all;
  }

  /* Style the dots by assigning a fill and stroke */
  .dot {
    fill: #ffab00;
    stroke: #fff;
  }

  .focus circle {
    fill: none;
    stroke: steelblue;
  }
`;
