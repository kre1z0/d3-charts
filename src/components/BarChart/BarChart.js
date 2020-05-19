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
  data: [],
  colors: ["#FFC34F", "#73CFCA"],
  labels: ["Инерционный", "Сценарный"],
};
