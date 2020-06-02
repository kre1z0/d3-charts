import React, { useState } from "react";
import { hot } from "react-hot-loader/root";
import format from "date-fns/format";
import { DatePicker, RaisedButton, NumberInput, Dropdown } from "@evergis/ui";

import {
  lineChartRandomData,
  stackedBarChartRandomData,
  horizontalBarChartRandomData,
  percentBarChartRandomData,
} from "helpers/development/random";
import { getDynamicLineChartData } from "components/DynamicLineChart/getData";
import { LineChart } from "components/LineChart/LineChart";
import { StackedBarChart } from "components/StackedBarChart/StackedBarChart";
import { HorizontalBarChart } from "components/HorizontalBarChart/HorizontalBarChart";
import { PercentBarChart } from "components/PercentBarChart/PercentBarChart";
import { DynamicLineChart, dimensions } from "components/DynamicLineChart/DynamicLineChart";
import { Item, PaddingX, Control } from "components/App/styled";

const formatDate = (date) => format(date, "d-Y-M");

export const App = hot(() => {
  const [linesCount, onSetLinesCount] = useState(10);
  const [start, onSetStart] = useState(new Date(2018, 11, 1));
  const [end, onSetEnd] = useState(new Date(2020, 0, 11));

  const [currDimension, onSetDimension] = useState("days");
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
      <Control>
        <RaisedButton onClick={() => onDynamicLineChartRandom(randomDynamicalData)}>Randomize data</RaisedButton>
        <PaddingX />
        <NumberInput
          label="lines count"
          width={100}
          counter
          min={1}
          max={999}
          value={linesCount}
          onChange={onSetLinesCount}
        />
        <PaddingX />
        <DatePicker label="from" id="from" type="date" value={start} onChange={onSetStart} />
        <PaddingX />
        <DatePicker label="to" id="to" type="date" value={end} onChange={onSetEnd} />
        <PaddingX />
        <Dropdown
          label="dimension"
          value={currDimension}
          width="140px"
          menuWidth="140px"
          options={dimensions.map((dimension) => ({ text: dimension, value: dimension }))}
          onChange={([{ value }]) => onSetDimension(value)}
        />
      </Control>
      <DynamicLineChart dimension={currDimension} data={dynamicLineChartData} start={start} end={end} />
      <Item>
        <RaisedButton onClick={() => onLineChartRandom(lineChartRandomData())}>Randomize data</RaisedButton>
        <br />
        <br />
        <LineChart data={lineChartData} />
      </Item>
      <Item>
        <RaisedButton onClick={() => onPercentBarChartRandom(percentBarChartRandomData())}>Randomize data</RaisedButton>
        <br />
        <br />
        <PercentBarChart data={percentBarChartData} />
      </Item>
      <Item>
        <RaisedButton onClick={() => onStackedBarChartRandom(stackedBarChartRandomData())}>Randomize data</RaisedButton>
        <br />
        <br />
        <StackedBarChart data={stackedBarChartData} />
      </Item>
      <Item>
        <RaisedButton onClick={() => onHorizontalBarChartRandom(horizontalBarChartRandomData())}>
          Randomize data
        </RaisedButton>
        <br />
        <br />
        <HorizontalBarChart data={horizontalBarChartData} />
      </Item>
    </>
  );
});
