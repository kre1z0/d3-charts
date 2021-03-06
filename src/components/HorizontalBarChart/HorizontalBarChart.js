import React from "react";

import { useDraw } from "./useDraw";
import { Container } from "./styled";

export const HorizontalBarChart = (props) => {
  const { width, height } = props;
  const [ref] = useDraw(props);

  return <Container ref={ref} width={width} height={height} />;
};

HorizontalBarChart.defaultProps = {
  width: 1200,
  data: [],
  colors: ["#FFC34F", "#1FB3AA", "#40C5A4", "#69D598", "#95E389", "#C5EF7B", "#F9F871"],
  labels: ["Инерционный", "Сценарный"],
};
