import React, { useState, useMemo } from "react";
import { hot } from "react-hot-loader/root";
import { DatePicker, RaisedButton, NumberInput, Dropdown, FieldValue } from "@evergis/ui";
import { groupBy, values } from "lodash";

import squares from "assets/products/squares";
import areas from "assets/products/areas";
import points from "assets/products/points";
import { getScuOptions } from "helpers/development/pepsico/options";
import { normalizeData } from "helpers/development/pepsico/normalize";
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

const testProducts = {
  squares,
  areas,
  points,
};

const products = {};

for (let i = 0; i < Object.keys(testProducts).length; i++) {
  const key = Object.keys(testProducts)[i];
  const item = testProducts[key];
  const groupedItem = groupBy(item, "product_id");

  products[key] = values(groupedItem);
}

export const App = hot(() => {
  const [scuValue, onSelectScu] = useState(null);
  const [geoValue, onSelectGeo] = useState("squares");

  const scuOptions = useMemo(() => getScuOptions(products[geoValue]), []);

  const { start: prodStart, end: prodEnd, data: prodData } = useMemo(
    () => normalizeData(products[geoValue][+scuValue]),
    [geoValue, scuValue],
  );

  const areasOptions = [
    { value: "squares", text: "Квадраты" },
    { value: "areas", text: "Районы" },
    { value: "points", text: "Точки" },
  ];

  const [linesCount, onSetLinesCount] = useState(10);
  const [start, onSetStart] = useState(new Date(2017, 11, 1));
  const [end, onSetEnd] = useState(new Date(2020, 0, 11));

  const [currDimension, onSetDimension] = useState("months");
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
        <RaisedButton
          onClick={() => {
            onSelectScu(null);
            onDynamicLineChartRandom(randomDynamicalData);
          }}
        >
          Randomize data
        </RaisedButton>
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
        <DatePicker
          disabled={scuValue !== null}
          label="from"
          id="from"
          type="date"
          value={scuValue !== null ? prodStart : start}
          onChange={onSetStart}
        />
        <PaddingX />
        <DatePicker
          disabled={scuValue !== null}
          label="to"
          id="to"
          type="date"
          value={scuValue !== null ? prodEnd : end}
          onChange={onSetEnd}
        />
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
      <Control style={{ paddingTop: 0 }}>
        <Dropdown
          label="Товар"
          options={scuOptions}
          value={scuValue}
          onChange={([{ value }]) => onSelectScu(value)}
          width="434px"
          menuHeight="264px"
        />
        <PaddingX />
        <Dropdown
          label="Геометрия"
          options={areasOptions}
          value={geoValue}
          onChange={([{ value }]) => onSelectGeo(value)}
          width="200px"
        />
        {scuValue !== null && (
          <>
            <PaddingX />
            <FieldValue field="lines" value={prodData.length} />
          </>
        )}
      </Control>
      <DynamicLineChart
        dimension={currDimension}
        data={scuValue !== null ? prodData : dynamicLineChartData}
        start={scuValue !== null ? prodStart : start}
        end={scuValue !== null ? prodEnd : end}
      />
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
