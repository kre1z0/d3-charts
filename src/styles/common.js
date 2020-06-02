import { css } from "styled-components";

export const commontStyles = css`
  body,
  html {
    overflow-y: auto;
    overflow-y: overlay;
    scrollbar-width: thin;
    ::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.12);
      border: 4px solid transparent;
      background-clip: content-box;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: rgba(0, 0, 0, 0.36);
    }

    ::-webkit-scrollbar-thumb:active {
      background-color: rgba(0, 0, 0, 0.36);
    }

    ::-webkit-scrollbar-corner {
      background-color: transparent;
    }
  }
`;
