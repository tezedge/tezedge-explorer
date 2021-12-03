import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { CloseStorageResources, LoadStorageResources, StorageResourcesActionTypes } from './storage-resources.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StorageResourcesStats } from '@shared/types/resources/storage/storage-resources-stats.type';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { storageResources } from '@resources/resources/resources.reducer';
import { State } from '@app/app.reducers';

const PROTOCOLS = [
  'All protocols',
  'Genesis',
  'Bootstrap',
  'Alpha1',
  'Alpha2',
  'Alpha3',
  'Athens_a',
  'Babylon',
  'Carthage',
  'Delphi',
  'Edo',
  'Florence',
  'Granada'
];

@UntilDestroy()
@Component({
  selector: 'app-storage-resources',
  templateUrl: './storage-resources.component.html',
  styleUrls: ['./storage-resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageResourcesComponent implements OnInit, OnDestroy {

  storageStats$: Observable<StorageResourcesStats>;
  miniGraphRef: ElementRef;
  expandedPanel: boolean = true;
  displayContextSwitcher: boolean;
  storageResourcesContext: string;
  readonly protocols = PROTOCOLS;
  activeProtocol = 'All protocols';

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

  togglePanel(): void {
    this.expandedPanel = !this.expandedPanel;
  }

  getStorageStatistics(): void {
    const context = this.storageResourcesContext === 'tezedge' ? 'irmin' : 'tezedge';
    this.loadResources(context);
    setTimeout(() => {
      this.storageResourcesContext = context;
      this.cdRef.detectChanges();
    }, 50);
  }

  ngOnDestroy(): void {
    this.store.dispatch<CloseStorageResources>({
      type: StorageResourcesActionTypes.STORAGE_RESOURCES_CLOSE
    });
  }

  selectProtocol(protocol: string): void {
    this.activeProtocol = protocol;
    if (protocol === this.protocols[0]) {
      protocol = '';
    }
    this.loadResources(this.storageResourcesContext, protocol);
  }

  private loadResources(context: string, protocol: string = ''): void {
    this.store.dispatch<LoadStorageResources>({
      type: StorageResourcesActionTypes.STORAGE_RESOURCES_LOAD,
      payload: { context, protocol: protocol.toLowerCase() }
    });
  }
}
