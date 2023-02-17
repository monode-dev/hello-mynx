import {
  Mx_Event,
  mx_doOnChange,
  mx_generateUniqueMemberKey,
  Mx_Var,
  mx_getTypeName,
  mx_is,
  mx_to,
  mx_wantLit,
  mx_wantVar,
  mx_isReactive,
  mx_expr,
  mx_watchWrite,
  miwi_mountHtml,
  mx_variantOf,
  print,
  watchPrint,
} from "./mx_core.js";
console.log(mx_wantLit(`Hello World`));
export const constructHtmlElement = function (mx_params) {
  const { role, onClick, style } = mx_params;
  return (() => {
    let newElement = document.createElement(`div`);
    newElement.onclick = onClick;
    mx_watchWrite(role, (value) => {
      newElement.role = value;
    });
    for (let [propKey, propVal] of Object.entries(mx_wantLit(style))) {
      mx_watchWrite(style[propKey], (value) => {
        newElement.style[propKey] = value;
      });
    }
    return newElement;
  })();
};
export const colors = (() => {
  const white = "#ffffffff";
  const almostWhite = "#f9fafdff";
  const pink = "#e91e63ff";
  const red = "#f44336ff";
  const orange = "#ff9800ff";
  const yellow = "#ffea00ff";
  const green = "#4caf50ff";
  const teal = "#009688ff";
  const blue = "#2196f3ff";
  const purple = "#9c27b0ff";
  const brown = "#795548ff";
  const grey = "#9e9e9eff";
  const black = "#000000ff";
  const transparent = "#ffffff00";
  return {
    white: white,
    almostWhite: almostWhite,
    pink: pink,
    red: red,
    orange: orange,
    yellow: yellow,
    green: green,
    teal: teal,
    blue: blue,
    purple: purple,
    brown: brown,
    grey: grey,
    black: black,
    transparent: transparent,
  };
})();
export const unstyledCss = (() => {
  const display = "";
  const boxSizing = "";
  const width = "";
  const minWidth = "";
  const maxWidth = "";
  const height = "";
  const minHeight = "";
  const maxHeight = "";
  const flexBasis = "";
  const borderRadius = "";
  const outline = "";
  const outlineOffset = "";
  const backgroundColor = "";
  const boxShadow = "";
  const padding = "";
  const position = "";
  const justifyContent = "";
  const alignItems = "";
  const flexDirection = "";
  const flexWrap = "";
  const overflowX = "";
  const overflowY = "";
  const scrollbarWidth = "";
  const scrollbarColor = "";
  const rowGap = "";
  const columnGap = "";
  const fontFamily = "";
  const fontSize = "";
  const fontWeight = "";
  const fontStyle = "";
  const textDecoration = "";
  const textAlign = "";
  const color = "";
  return {
    display: display,
    boxSizing: boxSizing,
    width: width,
    minWidth: minWidth,
    maxWidth: maxWidth,
    height: height,
    minHeight: minHeight,
    maxHeight: maxHeight,
    flexBasis: flexBasis,
    borderRadius: borderRadius,
    outline: outline,
    outlineOffset: outlineOffset,
    backgroundColor: backgroundColor,
    boxShadow: boxShadow,
    padding: padding,
    position: position,
    justifyContent: justifyContent,
    alignItems: alignItems,
    flexDirection: flexDirection,
    flexWrap: flexWrap,
    overflowX: overflowX,
    overflowY: overflowY,
    scrollbarWidth: scrollbarWidth,
    scrollbarColor: scrollbarColor,
    rowGap: rowGap,
    columnGap: columnGap,
    fontFamily: fontFamily,
    fontSize: fontSize,
    fontWeight: fontWeight,
    fontStyle: fontStyle,
    textDecoration: textDecoration,
    textAlign: textAlign,
    color: color,
  };
})();
export const CssStyle = unstyledCss;
