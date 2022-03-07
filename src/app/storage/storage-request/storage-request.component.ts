import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import {
  STORAGE_REQUESTS_INIT,
  STORAGE_REQUESTS_STOP,
  StorageRequestInitAction,
  StorageRequestStopAction
} from '@storage/storage-request/storage-request.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { selectStorageRequests } from '@storage/storage-request/storage-request.reducer';
import { StorageRequest } from '@shared/types/storage/request/storage-request.type';

@UntilDestroy()
@Component({
  selector: 'app-storage-request',
  templateUrl: './storage-request.component.html',
  styleUrls: ['./storage-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageRequestComponent implements OnInit, OnDestroy {

  requests: StorageRequest[];

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.dispatch<StorageRequestInitAction>({ type: STORAGE_REQUESTS_INIT });
    this.listenToStorageRequestChanges();
  }

  private listenToStorageRequestChanges(): void {
    this.store.select(selectStorageRequests)
      .pipe(untilDestroyed(this))
      .subscribe((requests: StorageRequest[]) => {
        this.requests = requests;
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch<StorageRequestStopAction>({ type: STORAGE_REQUESTS_STOP });
  }
}
