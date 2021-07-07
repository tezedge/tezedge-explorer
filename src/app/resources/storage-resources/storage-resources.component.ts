import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { StorageResourcesActionTypes } from './storage-resources.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StorageResourcesStats } from '../../shared/types/resources/storage/storage-resources-stats.type';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { storageResources } from '../resources/resources.reducer';

@UntilDestroy()
@Component({
  selector: 'app-storage-resources',
  templateUrl: './storage-resources.component.html',
  styleUrls: ['./storage-resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageResourcesComponent implements OnInit {

  storageStats$: Observable<StorageResourcesStats>;
  miniGraphRef: ElementRef;
  expandedPanel: boolean = true;
  displayContextSwitcher: boolean;
  storageResourcesContext: string;

  @ViewChild('miniGraph', { read: ElementRef }) set miniGraph(content: ElementRef) {
    if (content) {
      this.miniGraphRef = content;
      this.cdRef.detectChanges();
    }
  }

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listenToStorageStateChange();
    this.storageStats$ = this.store.pipe(
      untilDestroyed(this),
      select(storageResources),
      filter(value => !!value),
      map(value => value.storageResources)
    );

    this.store.dispatch({ type: StorageResourcesActionTypes.STORAGE_RESOURCES_CHECK_AVAILABLE_CONTEXTS, payload: ['tezedge', 'irmin'] });
  }

  togglePanel(): void {
    this.expandedPanel = !this.expandedPanel;
  }

  getStorageStatistics(): void {
    const newContext = this.storageResourcesContext === 'tezedge' ? 'irmin' : 'tezedge';
    this.store.dispatch({
      type: StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD,
      payload: newContext
    });
    setTimeout(() => {
      this.storageResourcesContext = newContext;
      this.cdRef.detectChanges();
    }, 50);
  }

  private listenToStorageStateChange(): void {
    this.store.pipe(
      untilDestroyed(this),
      select(storageResources),
      filter(value => !!value),
    ).subscribe(storageResourcesState => {
      if (!this.storageResourcesContext) {
        this.storageResourcesContext = storageResourcesState.availableContexts[0];
      }
      this.displayContextSwitcher = storageResourcesState.availableContexts.length > 1;
      this.cdRef.detectChanges();
    });
  }
}
