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
export const clickCount = Mx_Var.ofVal(0);
export const element = constructHtmlElement(
  (() => {
    const role = "div";
    const onClick = function (mx_params) {
      return (() => {
        if (!(mx_wantLit(clickCount) >= 7)) {
          if (mx_wantLit(background) === colors.green) {
            background.mx_write(colors.pink);
          } else {
            background.mx_write(colors.green);
          }
        } else {
          if (mx_wantLit(background) === colors.yellow) {
            background.mx_write(colors.blue);
          } else {
            background.mx_write(colors.yellow);
          }
        }
        clickCount.mx_write(mx_wantLit(clickCount) + 1);
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
