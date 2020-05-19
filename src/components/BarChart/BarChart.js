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
    { name: "Численность населения", inertial: 45, scenario: 65 },
    { name: "ВГП на дущу населения", inertial: 25, scenario: 75 },
    { name: "ВГП", apples: 640, inertial: 35, scenario: 65 },
    { name: "Доходы бюджетов", inertial: -20, scenario: 100 },
    { name: "Прибыль предприятий", inertial: -40, scenario: 100 },
    { name: "Инвестиции", inertial: 10, scenario: 100 },
    { name: "Жилобеспеченность", inertial: 48, scenario: 52 },
  ],
  colors: ["#FFC34F", "#73CFCA"],
  labels: ["Инерционный", "Сценарный"],
};
