import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, InjectGlobalStyles } from "@evergis/ui";

import { GlobalStyle } from "styles";
import { App } from "components/App/App";

ReactDOM.render(
  <ThemeProvider>
    <InjectGlobalStyles />
    <GlobalStyle />
    <App />
  </ThemeProvider>,
  document.getElementById("container"),
);
