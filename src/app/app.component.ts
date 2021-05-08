import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { State } from './app.reducers';
import { NetworkStats } from './shared/types/network/network-stats.type';
import { SettingsNode } from './shared/types/settings-node/settings-node.type';
import { App } from './shared/types/app/app.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  app: App;
  isMobile = false;

  onDestroy$ = new Subject();
  pendingTransactions: any[];
  networkStats$: Observable<NetworkStats>;
  settingsNodeProtocol$: Observable<string>;

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth < 600 && !this.isMobile) {
      this.store.dispatch({ type: 'APP_MENU_STATE_CHANGE', payload: { mode: 'over' } });
      this.isMobile = true;
    } else if (window.innerWidth >= 600 && this.isMobile) {
      this.store.dispatch({ type: 'APP_MENU_STATE_CHANGE', payload: { mode: 'side' } });
      this.isMobile = false;
    }
  }

  constructor(
    public store: Store<State>,
    public router: Router,
  ) {
    // when inside Cypress testing environment, put the store on window so Cypress have access to it
    if ((window as any).Cypress) {
      (window as any).store = this.store;
    }

    this.isMobile = window.innerWidth < 600;
  }

  ngOnInit(): void {
    this.initAppData();
    this.getMempoolPendingTransactions();
    this.getNetworkStatsData();
    this.getSettingsNode();

    if (this.isMobile) {
      this.store.dispatch({ type: 'APP_MENU_STATE_CHANGE', payload: { mode: 'over' } });
    }
  }

  private getSettingsNode(): void {
    this.settingsNodeProtocol$ = this.store.select((state: State) => state.settingsNode)
      .pipe(
        filter(settingsNode => !!settingsNode.entities[settingsNode.activeNode.id].header),
        map((settingsNode: SettingsNode) => settingsNode.entities[settingsNode.activeNode.id].header.protocol)
      );
  }

  private getNetworkStatsData(): void {
    this.networkStats$ = this.store.select('networkStats').pipe(debounceTime(200));
  }

  private initAppData(): void {
    this.store.select('app')
      .subscribe(data => {
        this.app = data;
      });
  }

  private getMempoolPendingTransactions(): void {
    // subscribe to mempool to get pending transactions
    this.store.select('mempoolAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((mempool) => {
        this.pendingTransactions = mempool.ids;
        // this.pendingTransactions = mempool.ids.filter(id => mempool.entities[id].type == 'applied' || mempool.entities[id].type == 'unprocessed')
      });
  }

  changeTheme(theme) {

    // TODO: enabled once we have white theme ready
    // this.store.dispatch({
    //   type: 'APP_THEME_CHANGE',
    //   payload: theme,
    // });

    // // change theme
    // (document.getElementById('app-style-theme') as any).href = 'styles.' + theme + '.css';

  }

  sandboxBakeBlock() {
    if (this.app.statusbar.sandbox) {
      this.store.dispatch({
        type: 'SANDBOX_BAKE_BLOCK',
      });
    }
  }

  toggleMenuOnMobile(): void {
    this.store.dispatch({
      type: 'APP_TOGGLE_SIDENAV',
      payload: { isVisible: !this.app.sidenav.isVisible }
    });
  }

  ngOnDestroy() {
    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
