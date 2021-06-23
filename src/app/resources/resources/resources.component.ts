import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { State } from '../../app.reducers';
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
export class ResourcesComponent implements OnInit {

  tabs = [
    { title: 'System overview', id: 1, link: 'system' },
    { title: 'Storage', id: 2, link: 'storage' },
    { title: 'Memory', id: 3, link: 'memory' }
  ];
  reversedCheckboxState = false;
  activeRoute: string;
  storageResourcesContext = 'tezedge';
  displayContextSwitcher: boolean;

  constructor(private store: Store<State>,
              private router: Router,
              private route: ActivatedRoute,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listenToRouteChange();
    this.listenToStorageStateChange();
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
      type: StorageResourcesActionTypes.LOAD_RESOURCES,
      payload: this.storageResourcesContext
    });
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
