import React from "react";
import { hot } from "react-hot-loader/root";

import { useDraw } from "./useDraw";
import { Container } from "./styled";

export const LineChartD3Base = (props) => {
  const [_, ref] = useDraw(props);

  return <Container ref={ref} />;
};

LineChartD3Base.defaultProps = {
  width: 800,
  height: 300,
};

export const LineChartD3 = hot(LineChartD3Base);
