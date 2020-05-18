import React from "react";

import { GlobalStyle } from "styles";
import { LineChartD3 } from "components/LineChart/LineChart";
import { Item } from "components/App/styled";

export const App = () => (
  <>
    <GlobalStyle />
    <Item>
      <LineChartD3 />
    </Item>
  </>
);
