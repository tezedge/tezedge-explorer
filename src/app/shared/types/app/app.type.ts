import { AppSidenav } from './app-sidenav.type';
import { AppToolbar } from './app-toolbar.type';
import { AppMenu } from './app-menu.type';

export class App {
  initialized: boolean;
  sidenav: AppSidenav;
  toolbar: AppToolbar;
  logo: { isVisible: boolean };
  menu: AppMenu;
  theme: { name: 'dark' | 'light' };
  statusbar: { sandbox: boolean };
}
