import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { StorageResourcesActionTypes } from './resources-storage.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StorageResourcesStats } from '../../shared/types/resources/storage/storage-resources-stats.type';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-resources-storage',
  templateUrl: './resources-storage.component.html',
  styleUrls: ['./resources-storage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesStorageComponent implements OnInit {

  storageStats$: Observable<StorageResourcesStats>;
  miniGraphRef: ElementRef;
  totalTime: number;
  totalCalls: number;
  totalTimeRead: number;
  totalTimeWrite: number;

  @ViewChild('miniGraph', { read: ElementRef }) set content(content: ElementRef) {
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
      tap((value: StorageResourcesStats) => {
        this.totalTime = value.operationsContext.reduce((sum, current) => sum + current.totalTime, 0);
        this.totalTime += value.checkoutContext.totalTime;
        this.totalTime += value.commitContext.totalTime;
        this.totalTimeRead = value.operationsContext.reduce((sum, current) => sum + current.totalTimeRead, 0);
        this.totalTimeWrite = value.operationsContext.reduce((sum, current) => sum + current.totalTimeWrite, 0);
        this.totalCalls = value.operationsContext.reduce((sum, current) => sum + current.actionsCount, 0);
        this.totalCalls += value.checkoutContext.actionsCount;
        this.totalCalls += value.commitContext.actionsCount;
      })
    );

    this.store.dispatch({ type: StorageResourcesActionTypes.LoadResources, payload: 'tezedge' });
  }

}
