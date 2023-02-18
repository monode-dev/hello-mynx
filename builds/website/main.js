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
export const clickCount = Mx_Var.ofVal(0);
export const shouldSwapColors = mx_expr(
  [clickCount],
  (mx_exprParams) => mx_exprParams[0] < 4,
);
export const colorA = mx_expr([shouldSwapColors], (mx_exprParams) =>
  (() => {
    if (mx_exprParams[0]) {
      return colors.yellow;
    } else {
      return colors.green;
    }
  })(),
);
export const colorB = mx_expr([shouldSwapColors], (mx_exprParams) =>
  (() => {
    if (mx_exprParams[0]) {
      return colors.blue;
    } else {
      return colors.pink;
    }
  })(),
);
export const background = Mx_Var.ofVal(mx_wantLit(colorA));
export const element = constructHtmlElement(
  (() => {
    const role = "div";
    const onClick = function (mx_params) {
      return (() => {
        background.mx_write(
          (() => {
            if (mx_wantLit(background) === mx_wantLit(colorA)) {
              return mx_wantLit(colorB);
            } else {
              return mx_wantLit(colorA);
            }
          })(),
        );
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
