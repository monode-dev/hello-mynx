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
import { colors, constructHtmlElement, CssStyle } from "./html.js";
export const background = Mx_Var.ofVal(colors.yellow);
export const element = constructHtmlElement(
  (() => {
    const role = "div";
    const onClick = function (mx_params) {
      return (() => {
        background.mx_write(colors.green);
      })();
    };
    const style = mx_variantOf(
      CssStyle,
      (() => {
        const width = "500px";
        const height = "500px";
        const backgroundColor = background;
        return {
          width: width,
          height: height,
          backgroundColor: backgroundColor,
        };
      })(),
    );
    return {
      role: role,
      onClick: onClick,
      style: style,
    };
  })(),
);
document.body.appendChild(mx_wantLit(element));
