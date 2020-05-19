import React, { useState } from "react";
import { hot } from "react-hot-loader/root";

import { lineChartRandomData, stackedBarChartRandomData } from "helpers/development/random";
import { GlobalStyle } from "styles";
import { LineChart } from "components/LineChart/LineChart";
import { StackedBarChart } from "components/StackedBarChart/StackedBarChart";
import { Item } from "components/App/styled";

export const App = hot(() => {
  const [lineChartData, onLineChartRandom] = useState(lineChartRandomData());
  const [stackedBarChartData, onStackedBarChartRandom] = useState(stackedBarChartRandomData());

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
    </>
  );
});
