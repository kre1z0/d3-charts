import React, { useState } from "react";

import { randomData } from "utils/array";
import { GlobalStyle } from "styles";
import { LineChartD3 } from "components/LineChart/LineChart";
import { Item } from "components/App/styled";

const lineChartRandomData = () => randomData({ length: 10, count: 2, from: -200, to: 400 });

export const App = () => {
  const [lineChartData, onLineChartRandom] = useState(lineChartRandomData());

  return (
    <>
      <GlobalStyle />
      <Item>
        <button onClick={() => onLineChartRandom(lineChartRandomData())}>Randomize data</button>
        <br />
        <br />
        <LineChartD3 data={lineChartData} />
      </Item>
    </>
  );
};
