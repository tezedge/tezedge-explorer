import { ThemeType } from '@shared/types/core/theme-switcher/theme-types.type';

export interface Theme {
  name: ThemeType;
  cssVariables: { [p: string]: string };
}
