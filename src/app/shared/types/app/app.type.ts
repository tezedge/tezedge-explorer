import { AppSidenav } from './app-sidenav.type';
import { AppToolbar } from './app-toolbar.type';
import { AppMenu } from './app-menu.type';
import { AppTheme } from '@shared/types/app/app-theme.type';

export class App {
  initialized: boolean;
  sidenav: AppSidenav;
  toolbar: AppToolbar;
  menu: AppMenu;
  theme: AppTheme;
  statusbar: { sandbox: boolean };
}
