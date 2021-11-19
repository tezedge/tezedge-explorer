import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, NgZone, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { debounceTime, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { State } from '@app/app.reducers';
import { NetworkStats } from '@shared/types/network/network-stats.type';
import { SettingsNode } from '@shared/types/settings-node/settings-node.type';
import { App } from '@shared/types/app/app.type';
import { selectActiveNode } from '@settings/settings-node.reducer';
import { SettingsNodeApi } from '@shared/types/settings-node/settings-node-api.type';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  app: App;
  isMobile = false;

  pendingTransactions$: Observable<any[]>;
  networkStats$: Observable<NetworkStats>;
  settingsNodeProtocol$: Observable<string>;
  activeNode$: Observable<SettingsNodeApi>;

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth < 600 && !this.isMobile) {
      this.store.dispatch({ type: 'APP_MENU_STATE_CHANGE', payload: { mode: 'over' } });
      this.isMobile = true;
    } else if (window.innerWidth >= 600 && this.isMobile) {
      this.store.dispatch({ type: 'APP_MENU_STATE_CHANGE', payload: { mode: 'side' } });
      this.isMobile = false;
    }
    this.cdRef.detectChanges();
  }

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              zone: NgZone) {
    // when inside Cypress testing environment, put the store on window so Cypress have access to it
    if ((window as any).Cypress || (window as any).playwright) {
      (window as any).store = this.store;
      (window as any).zone = zone;
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
    this.activeNode$ = this.store.select(selectActiveNode);
    this.settingsNodeProtocol$ = this.store.select((state: State) => state.settingsNode)
      .pipe(
        filter(settingsNode => !!settingsNode.entities[settingsNode.activeNode?.id].header),
        map((settingsNode: SettingsNode) => settingsNode.entities[settingsNode.activeNode.id].header.protocol)
      );
  }

  private getNetworkStatsData(): void {
    this.networkStats$ = this.store.select('networkStats').pipe(debounceTime(200));
  }

  private initAppData(): void {
    this.store.select('app').subscribe(data => {
      this.app = data;
      this.cdRef.detectChanges();
    });
  }

  private getMempoolPendingTransactions(): void {
    this.pendingTransactions$ = this.store.select('mempoolAction').pipe(map(mempool => mempool.ids));
    // this.pendingTransactions = mempool.ids.filter(id => mempool.entities[id].type == 'applied' || mempool.entities[id].type == 'unprocessed')
  }

  changeTheme(theme) {
    // TODO: enabled once we have white theme ready
    // this.store.dispatch({
    //   type: 'APP_THEME_CHANGE',
    //   payload: theme,
    // });
    //
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
}
