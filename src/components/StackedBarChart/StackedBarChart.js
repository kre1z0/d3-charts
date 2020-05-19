import React from "react";

import { useDraw } from "./useDraw";
import { Container } from "./styled";

export const StackedBarChart = (props) => {
  const { width, height } = props;
  const [ref] = useDraw(props);

  return <Container ref={ref} width={width} height={height} />;
};

StackedBarChart.defaultProps = {
  width: 1200,
  height: 300,
  data: [],
  colors: ["#FFC34F", "#1FB3AA"],
  labels: ["Инерционный", "Сценарный"],
};
