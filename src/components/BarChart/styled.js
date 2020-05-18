import styled from "styled-components";

export const Container = styled.div.attrs(({ width, height }) => ({
  style: {
    maxWidth: width,
    height,
  },
}))``;
