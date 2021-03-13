import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { Router } from '@angular/router';
import { SettingsNode } from '../../shared/types/settings-node/settings-node.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationMenuComponent implements OnInit {

  app;
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

  nodeSandboxAdd() {
    this.router.navigate(['/sandbox']);
  }

  nodeSandboxStop() {
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
