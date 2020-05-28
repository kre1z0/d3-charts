import React, { useState } from "react";
import { hot } from "react-hot-loader/root";
import format from "date-fns/format";

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
import { Item, PaddingX, NumberInput } from "components/App/styled";

const formatDate = (date) => format(date, "d-Y-M");

export const App = hot(() => {
  const start = new Date(2018, 11, 1);
  const end = new Date(2020, 10, 14);
  const [linesCount, onSetLinesCount] = useState(2);

  const randomDynamicalData = getDynamicLineChartData({ linesCount, start, end });
  const [dynamicLineChartData, onDynamicLineChartRandom] = useState(
    getDynamicLineChartData({ linesCount, start, end }),
  );
  const [lineChartData, onLineChartRandom] = useState(lineChartRandomData());
  const [stackedBarChartData, onStackedBarChartRandom] = useState(stackedBarChartRandomData());
  const [horizontalBarChartData, onHorizontalBarChartRandom] = useState(horizontalBarChartRandomData());
  const [percentBarChartData, onPercentBarChartRandom] = useState(percentBarChartRandomData());

  return (
    <>
      <GlobalStyle />
      <Item>
        <button onClick={() => onDynamicLineChartRandom(randomDynamicalData)}>Randomize data</button>
        <PaddingX />
        <label htmlFor="lines-count">lines count</label>{" "}
        <NumberInput
          id="lines-count"
          type="number"
          min={0}
          value={linesCount}
          onChange={({ target }) => onSetLinesCount(target.value)}
        />
        <PaddingX />
        from {formatDate(start)} to {formatDate(end)}
      </Item>
      <DynamicLineChart data={dynamicLineChartData} start={start} end={end} />
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
