import React from "react";

import { useDraw } from "./useDraw";
import { Container } from "./styled";

export const DynamicLineChart = (props) => {
  const { width, height } = props;
  const [ref] = useDraw(props);

  return <Container ref={ref} width={width} height={height} />;
};

DynamicLineChart.defaultProps = {
  width: window.innerWidth,
  height: 250,
  data: [],
  labels: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
  colors: ["#FFC34F", "#1FB3AA"],
};
