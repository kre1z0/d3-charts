import React from "react";
import { hot } from "react-hot-loader/root";

import { useDraw } from "./useDraw";
import { Container } from "./styled";

export const LineChartD3Base = (props) => {
  const [_, ref] = useDraw(props);

  return <Container ref={ref} />;
};

LineChartD3Base.defaultProps = {
  width: 1200,
  height: 300,
  data: [
    [200, 224, 380, 198, 255, 0, 250, 234, 210],
    [211, 231, 122, 55, 198, 12, 130, 220, 440],
  ],
  labels: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018],
};

export const LineChartD3 = hot(LineChartD3Base);
