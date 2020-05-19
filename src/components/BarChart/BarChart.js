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
    { name: "Численность населения", apples: 3840, bananas: 1920, cherries: -1960, dates: -400 },
    { name: "ВГП на дущу населения", apples: 1600, bananas: 1440, cherries: -960, dates: -400 },
    { name: "ВГП", apples: 640, bananas: 960, cherries: -640, dates: -600 },
    { name: "Доходы бюджетов", apples: 320, bananas: 480, cherries: -640, dates: -400 },
    { name: "Прибыль предприятий", apples: 320, bananas: 480, cherries: -640, dates: -400 },
    { name: "Инвестиции", apples: 320, bananas: 480, cherries: -640, dates: -400 },
    { name: "Жилобеспеченность", apples: 320, bananas: 480, cherries: -640, dates: -400 },
  ],
  colors: ["#FFC34F", "#73CFCA", "#61ff4f", "#b673cf"],
};
