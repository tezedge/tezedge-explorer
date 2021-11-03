import { ThemeType } from '@shared/types/core/theme-switcher/theme-types.type';
import { Theme } from '@shared/types/core/theme-switcher/theme.type';

export interface AppTheme {
  active: ThemeType;
  values: Theme[];
}
