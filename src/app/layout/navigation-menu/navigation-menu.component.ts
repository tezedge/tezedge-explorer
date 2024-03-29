import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { Router } from '@angular/router';
import { SettingsNode } from '@shared/types/settings-node/settings-node.type';
import { filter } from 'rxjs';
import { App } from '@shared/types/app/app.type';
import { appState } from '@app/app.reducer';


@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationMenuComponent implements OnInit, AfterViewInit {

  app: App;
  settingsNode: SettingsNode;
  features: { [p: string]: string };

  haveResources: boolean;
  haveExplorer: boolean;
  haveSandbox: boolean;
  haveDebugger: boolean;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private router: Router) { }

  ngOnInit(): void {
    this.getAppState();
    this.getFeatures();
  }

  ngAfterViewInit(): void {
    this.closeMenu();
  }

  private getAppState(): void {
    this.store.select(appState)
      .subscribe(state => {
        this.app = state;
        this.cdRef.detectChanges();
      });
  }

  private getFeatures(): void {
    this.store.select('settingsNode')
      .pipe(
        filter(node => !!node.activeNode),
        filter(node => !!node.activeNode?.features),
      )
      .subscribe((node: SettingsNode) => {
        const features = {};
        node.activeNode.features.forEach(feature => features[feature.name] = feature);
        this.settingsNode = node;
        this.haveDebugger = node.activeNode?.features?.some(f => f.name === 'debugger');
        this.haveResources = features['resources/system'] || features['resources/storage'] || features['resources/memory'];
        this.haveExplorer = features['network'] || features['storage'] || features['mempool'] || features['logs'] || features['endpoints'];
        this.haveSandbox = features['chains'] || features['wallets'] || features['sandbox'];
        this.features = features;
        this.cdRef.detectChanges();
      });
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

  addSandboxNode(): void {
    this.router.navigate(['/sandbox']);
  }

  stopSandboxNode(): void {
    this.store.dispatch({
      type: 'SANDBOX_NODE_STOP',
      payload: '',
    });
  }

  // sandboxBakeBlock(): void {
  //   if (this.app.statusbar.sandbox) {
  //     this.store.dispatch({
  //       type: 'SANDBOX_BAKE_BLOCK',
  //     });
  //   }
  // }
}
