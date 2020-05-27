import React, { useState } from "react";
import { hot } from "react-hot-loader/root";

import {
  lineChartRandomData,
  stackedBarChartRandomData,
  horizontalBarChartRandomData,
  percentBarChartRandomData,
} from "helpers/development/random";
import { GlobalStyle } from "styles";
import { getDynamicLineChartData } from "components/DynamicLineChart/getData";
import { LineChart } from "components/LineChart/LineChart";
import { StackedBarChart } from "components/StackedBarChart/StackedBarChart";
import { HorizontalBarChart } from "components/HorizontalBarChart/HorizontalBarChart";
import { PercentBarChart } from "components/PercentBarChart/PercentBarChart";
import { DynamicLineChart } from "components/DynamicLineChart/DynamicLineChart";
import { Item } from "components/App/styled";

export const App = hot(() => {
  const [dynamicLineChartData, ondynamicLineChartRandom] = useState(getDynamicLineChartData());
  const [lineChartData, onLineChartRandom] = useState(lineChartRandomData());
  const [stackedBarChartData, onStackedBarChartRandom] = useState(stackedBarChartRandomData());
  const [horizontalBarChartData, onHorizontalBarChartRandom] = useState(horizontalBarChartRandomData());
  const [percentBarChartData, onPercentBarChartRandom] = useState(percentBarChartRandomData());

  console.info("--> ggwp 4444 dynamicLineChartData", dynamicLineChartData);
  return (
    <>
      <GlobalStyle />
      <br />
      <button onClick={() => ondynamicLineChartRandom(getDynamicLineChartData())}>Randomize data</button>
      <br />
      <br />
      <DynamicLineChart data={lineChartData} />
      {/*<Item>*/}
      {/*  <button onClick={() => onLineChartRandom(lineChartRandomData())}>Randomize data</button>*/}
      {/*  <br />*/}
      {/*  <br />*/}
      {/*  <LineChart data={lineChartData} />*/}
      {/*</Item>*/}
      {/*<Item>*/}
      {/*  <button onClick={() => onPercentBarChartRandom(percentBarChartRandomData())}>Randomize data</button>*/}
      {/*  <br />*/}
      {/*  <br />*/}
      {/*  <PercentBarChart data={percentBarChartData} />*/}
      {/*</Item>*/}
      {/*<Item>*/}
      {/*  <button onClick={() => onStackedBarChartRandom(stackedBarChartRandomData())}>Randomize data</button>*/}
      {/*  <br />*/}
      {/*  <br />*/}
      {/*  <StackedBarChart data={stackedBarChartData} />*/}
      {/*</Item>*/}
      {/*<Item>*/}
      {/*  <button onClick={() => onHorizontalBarChartRandom(horizontalBarChartRandomData())}>Randomize data</button>*/}
      {/*  <br />*/}
      {/*  <br />*/}
      {/*  <HorizontalBarChart data={horizontalBarChartData} />*/}
      {/*</Item>*/}
    </>
  );
});
