import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { State } from '../../app.reducers';
import { SettingsNodeApi } from '../../shared/types/settings-node/settings-node-api.type';
import { StorageResourcesActionTypes } from '../storage-resources/storage-resources.actions';
import { MemoryResourcesActionTypes } from '../memory-resources/memory-resources.actions';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesComponent implements OnInit, OnDestroy {

  tabs = [
    { title: 'System overview', id: 1, link: 'system' },
    { title: 'Storage', id: 2, link: 'storage' },
    { title: 'Memory', id: 3, link: 'memory' }
  ];
  activeTabId: number = 1;
  storageNodeStats = 'tezedge';
  reversedCheckboxState = false;
  activeRoute: string;

  constructor(private store: Store<State>,
              private router: Router,
              private route: ActivatedRoute,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listenToNodeChange();
    this.listenToRouteChange();
  }

  onTabChange(): void {
    this.reversedCheckboxState = false;
    this.storageNodeStats = 'tezedge';
  }

  private listenToRouteChange(): void {
    this.activeRoute = this.router.url.split('/').pop();
    this.router.events
      .pipe(untilDestroyed(this), filter(ev => ev instanceof NavigationEnd))
      .subscribe((ev: NavigationEnd) => this.activeRoute = ev.urlAfterRedirects.split('/').pop());
  }

  private listenToNodeChange(): void {
    this.store.pipe(
      untilDestroyed(this),
      select(state => state.settingsNode.activeNode),
    ).subscribe((settingsNode: SettingsNodeApi) => {
      if (settingsNode.id === 'ocaml' && this.tabs.find(tab => tab.title === 'Memory')) {
        this.activeTabId = this.activeTabId === 3 ? 1 : this.activeTabId;
        this.tabs.splice(this.tabs.findIndex(tab => tab.title === 'Memory'), 1);
      } else if (settingsNode.id !== 'ocaml' && !this.tabs.find(tab => tab.title === 'Memory')) {
        this.tabs.push({ title: 'Memory', id: 3, link: 'memory' });
      }
      this.cdRef.detectChanges();
    });
  }

  getStorageStatistics(): void {
    this.storageNodeStats = this.storageNodeStats === 'tezedge' ? 'irmin' : 'tezedge';
    this.store.dispatch({
      type: StorageResourcesActionTypes.LoadResources,
      payload: this.storageNodeStats
    });
  }

  ngOnDestroy(): void {
  }

  onReversedCheckboxChange(event: MatCheckboxChange): void {
    this.reversedCheckboxState = event.checked;
    this.cdRef.detectChanges();
    this.store.dispatch({
      type: MemoryResourcesActionTypes.LoadResources,
      payload: { reversed: this.reversedCheckboxState }
    });
  }
}
