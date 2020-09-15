import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, Observable, Subscription } from 'rxjs';
import { takeUntil, map, debounceTime, filter } from 'rxjs/operators';
import { VirtualScrollDirective } from '../../shared/virtual-scroll.directive';

@Component({
  selector: 'app-mempool-action',
  templateUrl: './mempool-action.component.html',
  styleUrls: ['./mempool-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MempoolActionComponent implements OnInit, OnDestroy {

  public mempoolAction;
  public mempoolActionList = [];

  public networkAction;
  public networkActionList = [];

  public onDestroy$ = new Subject();

  public networkAction$;
  public networkDataSource;
  public networkActionlastCursorId = 0;

  @ViewChild(VirtualScrollDirective) vrFor: VirtualScrollDirective;

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit(): void {

    // wait for data changes from redux
    this.store.select('mempoolAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.mempoolAction = data;
      });

    // triger action and get mempool data
    this.store.dispatch({
      type: 'MEMPOOL_ACTION_LOAD',
    });

    // wait for data changes from redux
    this.store.select('networkAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        if (this.networkActionlastCursorId < data.lastCursorId) {

          // console.log('[networkAction]', this.networkActionlastCursorId, data.lastCursorId);
          this.networkActionlastCursorId = data.lastCursorId;

          setTimeout(() => {
            // this.viewPort.scrollTo({ bottom: 0 });
          });

        }

      });

  }

  getVirtulScrollItems($event) {
    console.log('[getVirtulScrollItems]', $event);
  }

  scrollToBottom() {
    this.vrFor.scrollToBottom();
  }

  ngOnDestroy() {

    // stop streaming actions
    this.store.dispatch({
      type: 'MEMPOOL_ACTION_STOP'
    });

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
