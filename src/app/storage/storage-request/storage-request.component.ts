import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import {
  STORAGE_REQUESTS_INIT,
  STORAGE_REQUESTS_STOP,
  STORAGE_REQUESTS_STREAM_CHANGE,
  StorageRequestInitAction,
  StorageRequestStopAction,
  StorageRequestStreamChangeAction
} from '@storage/storage-request/storage-request.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { selectStorageRequestState } from '@storage/storage-request/storage-request.reducer';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { StorageRequestState } from '@storage/storage-request/storage-request.index';
import { fromEvent, throttleTime } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HammerGesturesMigration } from '@angular/material/schematics/ng-update/migrations/hammer-gestures-v9/hammer-gestures-migration';

@UntilDestroy()
@Component({
  selector: 'app-storage-request',
  templateUrl: './storage-request.component.html',
  styleUrls: ['./storage-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageRequestComponent implements OnInit, OnDestroy {

  state: StorageRequestState;

  @ViewChild(CdkVirtualScrollViewport) private cdkVirtualScrollViewport: CdkVirtualScrollViewport;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.dispatch<StorageRequestInitAction>({ type: STORAGE_REQUESTS_INIT });
    this.listenToStorageRequestChanges();
    this.listenToVirtualScrolling();
  }

  private listenToStorageRequestChanges(): void {
    this.store.select(selectStorageRequestState)
      .pipe(untilDestroyed(this))
      .subscribe((state: StorageRequestState) => {
        this.state = state;
        this.cdRef.detectChanges();
        this.scrollToEnd();
      });
  }

  private listenToVirtualScrolling(): void {
    fromEvent(this.cdkVirtualScrollViewport.elementRef.nativeElement, 'wheel')
      .pipe(
        untilDestroyed(this),
        throttleTime(600),
        filter((event: WheelEvent) => this.state.stream && event.deltaY < 0)
      )
      .subscribe(() => this.pause());
    fromEvent(this.cdkVirtualScrollViewport.elementRef.nativeElement, 'touchmove')
      .pipe(
        untilDestroyed(this),
        throttleTime(600),
        filter(() => this.state.stream)
      )
      .subscribe(() => this.pause());
  }

  scrollToEnd(): void {
    this.cdkVirtualScrollViewport.scrollTo({ bottom: 0 });
  }

  live(): void {
    this.changeStream(true);
  }

  pause(): void {
    this.changeStream(false);
  }

  private changeStream(stream: boolean): void {
    this.store.dispatch<StorageRequestStreamChangeAction>({ type: STORAGE_REQUESTS_STREAM_CHANGE, payload: { stream } });
  }

  ngOnDestroy(): void {
    this.store.dispatch<StorageRequestStopAction>({ type: STORAGE_REQUESTS_STOP });
  }
}
