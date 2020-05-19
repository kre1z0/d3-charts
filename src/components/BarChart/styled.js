import styled from "styled-components";

export const Container = styled.div.attrs(({ width, height }) => ({
  style: {
    maxWidth: width,
    height,
  },
}))`
  text {
    color: #b7b9bd;
  }
`;
