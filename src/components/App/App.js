import React, { useState } from "react";
import { hot } from "react-hot-loader/root";

import {
  lineChartRandomData,
  stackedBarChartRandomData,
  horizontalBarChartRandomData,
} from "helpers/development/random";
import { GlobalStyle } from "styles";
import { LineChart } from "components/LineChart/LineChart";
import { StackedBarChart } from "components/StackedBarChart/StackedBarChart";
import { HorizontalBarChart } from "components/HorizontalBarChart/HorizontalBarChart";
import { Item } from "components/App/styled";

export const App = hot(() => {
  const [lineChartData, onLineChartRandom] = useState(lineChartRandomData());
  const [stackedBarChartData, onStackedBarChartRandom] = useState(stackedBarChartRandomData());
  const [horizontalBarChartData, onHorizontalBarChartRandom] = useState(horizontalBarChartRandomData());

  return (
    <>
      <GlobalStyle />
      <Item>
        <button onClick={() => onLineChartRandom(lineChartRandomData())}>Randomize data</button>
        <br />
        <br />
        <LineChart data={lineChartData} />
      </Item>

      <Item>
        <button onClick={() => onStackedBarChartRandom(stackedBarChartRandomData())}>Randomize data</button>
        <br />
        <br />
        <StackedBarChart data={stackedBarChartData} />
      </Item>
      <Item>
        <button onClick={() => onHorizontalBarChartRandom(horizontalBarChartRandomData())}>Randomize data</button>
        <br />
        <br />
        <HorizontalBarChart data={horizontalBarChartData} />
      </Item>
    </>
  );
});
