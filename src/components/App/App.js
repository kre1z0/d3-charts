import React, { useState } from "react";
import { hot } from "react-hot-loader/root";

import { randomData } from "utils/array";
import { GlobalStyle } from "styles";
import { LineChart } from "components/LineChart/LineChart";
import { Item } from "components/App/styled";

const lineChartRandomData = () => randomData({ length: 10, count: 2, from: -200, to: 400 });

export const App = hot(() => {
  const [lineChartData, onLineChartRandom] = useState(lineChartRandomData());

  return (
    <>
      <GlobalStyle />
      <Item>
        <button onClick={() => onLineChartRandom(lineChartRandomData())}>Randomize data</button>
        <br />
        <br />
        <LineChart data={lineChartData} />
      </Item>
    </>
  );
});
