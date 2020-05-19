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
    {
      name: "Численность населения 1",
      inner: "20",
      scen: "40",
    },
    {
      name: "Численность населения 2",
      inner: "10",
      scen: "35",
    },
    {
      name: "Численность населения 3",
      inner: "25",
      scen: "55",
    },
    {
      name: "Численность населения 4",
      inner: "50",
      scen: "50",
    },
  ],
  colors: ["#FFC34F", "#73CFCA"],
};
