import { createGlobalStyle } from "styled-components";

const darkBlue = "#217093";
const inputBG = "#f3fafd";

export const StyledAuthGlobal = createGlobalStyle`
html {
  width: 100%;
  height: 100%;
}
body {
  background-color: #eff3f4;
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 16px;
  direction: ltr !important;
}
form {
  direction: rtl;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  margin: 0;
  padding: 2.25em;
  box-sizing: border-box;
  border: solid 1px #ddd;
  border-radius: 0.5em;
  font-family: "Source Sans Pro", sans-serif;
  .svgContainer {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 0 auto 3em;
    border-radius: 50%;
    pointer-events: none;
    div {
      position: relative;
      width: 100%;
      height: 0;
      overflow: hidden;
      border-radius: 50%;
      padding-bottom: 100%;
    }
    .mySVG {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      width: inherit;
      height: inherit;
      box-sizing: border-box;
      border: solid 2.5px ${darkBlue};
      border-radius: 50%;
    }
  }
  .inputGroup {
    margin: 0 0 2em;
    padding: 0;
    position: relative;
    &:last-of-type {
      margin-bottom: 0;
    }
  }

  input[type="email"],
  input[type="text"],
  input[type="number"],
  input[type="url"],
  input[type="search"],
  input[type="password"] {
    background-color: ${inputBG};
    border: solid 1px ${darkBlue};
    border-color: ${darkBlue};
    border-radius: 4px;
    -webkit-appearance: none;
    color: #353538;
    transition: box-shadow 0.2s linear, border-color 0.25s ease-out;
  }
  button {
    width: 100%;
    height: 65px;
    font-size: 1.55em;
    color: #fff;
    font-weight: 600;
  }

  .inputGroup2 {
    .visibility-checkbox {
      position: absolute;
      left: 4px;
      top: 15%;
    }
  }
}

  .portrait-container {
    display: none;
  }

`;
