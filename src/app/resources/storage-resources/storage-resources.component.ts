import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { StorageResourcesActionTypes } from './storage-resources.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StorageResourcesStats } from '../../shared/types/resources/storage/storage-resources-stats.type';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

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

  @ViewChild('miniGraph', { read: ElementRef }) set miniGraph(content: ElementRef) {
    if (content) {
      this.miniGraphRef = content;
      this.cdRef.detectChanges();
    }
  }

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.storageStats$ = this.store.pipe(
      untilDestroyed(this),
      select(state => state.resources.storageResources),
      filter(value => !!value),
    );

    this.store.dispatch({ type: StorageResourcesActionTypes.LoadResources, payload: 'tezedge' });
  }

  togglePanel(): void {
    this.expandedPanel = !this.expandedPanel;
  }

}
