import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { Router } from '@angular/router';
import { SettingsNode } from '../../shared/types/settings-node/settings-node.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { App } from '../../shared/types/app/app.type';

@UntilDestroy()
@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationMenuComponent implements OnInit, AfterViewInit {

  app: App;
  settingsNode: SettingsNode;
  appFeatures$: Observable<{ [p: string]: string }>;

  constructor(private store: Store<State>,
              private router: Router) { }

  ngOnInit(): void {
    this.store.select('app')
      .pipe(untilDestroyed(this))
      .subscribe(data => this.app = data);

    this.store.select('settingsNode')
      .pipe(untilDestroyed(this))
      .subscribe(settingsNode => {
        this.settingsNode = settingsNode;
      });

    this.appFeatures$ = this.store.select('settingsNode')
      .pipe(
        untilDestroyed(this),
        map((state: SettingsNode) => {
          const response = {};
          state.activeNode.features.forEach((feature: string) => response[feature] = feature);
          return response;
        }),
      );
  }

  ngAfterViewInit(): void {
    this.closeMenu();
  }

  closeMenu(): void {
    if (this.app.sidenav.mode === 'over') {
      this.store.dispatch({ type: 'APP_TOGGLE_SIDENAV', payload: { isVisible: false } });
    }
  }

  toggleMenuSize(): void {
    this.store.dispatch({
      type: 'APP_MENU_SIZE_CHANGE',
      payload: { collapsed: !this.app.sidenav.collapsed }
    });
  }

  addSandboxNode() {
    this.router.navigate(['/sandbox']);
  }

  stopSandboxNode() {
    this.store.dispatch({
      type: 'SANDBOX_NODE_STOP',
      payload: '',
    });
  }

  sandboxBakeBlock() {
    if (this.app.statusbar.sandbox) {
      this.store.dispatch({
        type: 'SANDBOX_BAKE_BLOCK',
      });
    }
  }
}
