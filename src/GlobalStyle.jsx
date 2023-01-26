import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    font-family: 'Do Hyeon', sans-serif;
  }

  body {
    margin: 0;
  }
`;

export default GlobalStyle;
