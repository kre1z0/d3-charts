import React from "react";

import { useDraw } from "./useDraw";
import { Container } from "./styled";

export const BarChart = (props) => {
  const { width, height } = props;
  const [ref] = useDraw(props);

  return <Container ref={ref} width={width} height={height} />;
};

BarChart.defaultProps = {
  width: 1200,
  height: 300,
  data: [
    [120, 224, 380, 198, 255, 0, 250, 234, 210],
    [211, -231, 122, 55, 198, 12, 130, 220, 120],
  ],
  labels: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018],
  colors: ["#FFC34F", "#73CFCA"],
};
