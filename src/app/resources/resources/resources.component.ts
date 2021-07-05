import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { State } from '../../app.reducers';
import { StorageResourcesActionTypes } from '../storage-resources/storage-resources.actions';
import { MemoryResourcesActionTypes } from '../memory-resources/memory-resources.actions';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { selectFeatures } from '../../settings/settings-node/settings-node.reducer';
import { Observable } from 'rxjs';

const AVAILABLE_TABS = [
  { title: 'System overview', link: 'system' },
  { title: 'Storage', link: 'storage' },
  { title: 'Memory', link: 'memory' }
];

@UntilDestroy()
@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesComponent implements OnInit {

  tabs$: Observable<any>;
  reversedCheckboxState = false;
  activeRoute: string;
  storageResourcesContext = 'tezedge';
  displayContextSwitcher: boolean;

  constructor(private store: Store<State>,
              private router: Router,
              private route: ActivatedRoute,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listenToNodeChange();
    this.listenToRouteChange();
    this.listenToStorageStateChange();
  }

  private listenToNodeChange(): void {
    this.tabs$ = this.store.pipe(
      untilDestroyed(this),
      select(selectFeatures),
      map(features => features.map(f => f.name).filter(name => name.includes('resources'))),
      tap(resourceFeatureNames => {
        if (!resourceFeatureNames.some(n => n.includes(this.activeRoute))) {
          this.router.navigate([resourceFeatureNames[0]], { relativeTo: this.route });
        }
      }),
      map(resourceFeatureNames => (
        AVAILABLE_TABS.filter(tab => resourceFeatureNames.some(name => name.includes(tab.link)))
      ))
    );
  }

  private listenToRouteChange(): void {
    this.activeRoute = this.router.url.split('/').pop();
    this.router.events
      .pipe(untilDestroyed(this), filter(ev => ev instanceof NavigationEnd))
      .subscribe((ev: NavigationEnd) => this.activeRoute = ev.urlAfterRedirects.split('/').pop());
  }

  private listenToStorageStateChange(): void {
    this.store.pipe(
      untilDestroyed(this),
      select(state => state.resources.storageResourcesState),
      filter(value => !!value),
    ).subscribe(storageResourcesState => {
      this.storageResourcesContext = storageResourcesState.availableContexts[0];
      this.displayContextSwitcher = storageResourcesState.availableContexts.length > 1;
      this.cdRef.detectChanges();
    });
  }

  onTabChange(): void {
    this.reversedCheckboxState = false;
  }

  getStorageStatistics(): void {
    this.storageResourcesContext = this.storageResourcesContext === 'tezedge' ? 'irmin' : 'tezedge';
    this.store.dispatch({
      type: StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD,
      payload: this.storageResourcesContext
    });
  }

  onReversedCheckboxChange(event: MatCheckboxChange): void {
    this.reversedCheckboxState = event.checked;
    this.cdRef.detectChanges();
    this.store.dispatch({
      type: MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD,
      payload: { reversed: this.reversedCheckboxState }
    });
  }
}
