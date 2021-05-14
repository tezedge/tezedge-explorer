import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { StorageResourcesActionTypes } from './resources-storage.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StorageResourcesStats } from '../../shared/types/resources/storage/storage-resources-stats.type';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
      tap(s => console.log(s.resources.storageResources)),
      select(state => state.resources.storageResources),
    );

    this.store.dispatch({ type: StorageResourcesActionTypes.LoadResources });
  }

}
