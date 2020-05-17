import React from "react";
import ReactDOM from "react-dom";

import { GlobalStyle } from "styles";
import { LineChartD3 } from "components/LineChart/LineChart";

export const App = () => (
  <>
    <GlobalStyle />
    <LineChartD3 />
  </>
);

ReactDOM.render(<App />, document.getElementById("container"));
