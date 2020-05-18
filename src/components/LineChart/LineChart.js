import React from "react";

import { useDraw } from "./useDraw";
import { Container } from "./styled";

export const LineChart = (props) => {
  const { width, height } = props;
  const [ref] = useDraw(props);

  return <Container ref={ref} width={width} height={height} />;
};

LineChart.defaultProps = {
  width: 1200,
  height: 300,
  data: [],
  labels: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018],
  colors: ["#FFC34F", "#73CFCA"],
};
