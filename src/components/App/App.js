import React, { useState } from "react";
import { hot } from "react-hot-loader/root";

import { randomData } from "utils/array";
import { GlobalStyle } from "styles";
import { LineChart } from "components/LineChart/LineChart";
import { BarChart } from "components/BarChart/BarChart";
import { Item } from "components/App/styled";

const lineChartRandomData = () => randomData({ length: 10, count: 2, from: -200, to: 400 });

const barChartRandomData = () => randomData({ length: 10, count: 2, from: -20, to: 100 });

export const App = hot(() => {
  const [lineChartData, onLineChartRandom] = useState(lineChartRandomData());
  const [barChartData, onBarChartRandom] = useState(barChartRandomData());

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
        <button onClick={() => onBarChartRandom(barChartRandomData())}>Randomize data</button>
        <br />
        <br />
        <BarChart data={barChartData} />
      </Item>
    </>
  );
});
