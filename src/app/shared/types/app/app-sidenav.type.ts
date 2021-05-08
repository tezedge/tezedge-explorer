import { MatDrawerMode } from '@angular/material/sidenav/drawer';

export class AppSidenav {
  isVisible: boolean;
  mode: MatDrawerMode;
  collapsed: boolean;
  backgroundColor: string;
  color: string;
  toggleButton: { isVisible: boolean };
}
