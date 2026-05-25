import "styled-components";
import type { AppTheme } from "./theme";

declare module "styled-components" {
  export interface DefaultTheme {
    color: AppTheme["color"];
    font: AppTheme["font"];
    typography: AppTheme["typography"];
    space: AppTheme["space"];
    radius: AppTheme["radius"];
    border: AppTheme["border"];
    elevation: AppTheme["elevation"];
    zIndex: AppTheme["zIndex"];
  }
}
