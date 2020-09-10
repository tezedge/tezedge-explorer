import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-mempool-action',
  templateUrl: './mempool-action.component.html',
  styleUrls: ['./mempool-action.component.scss']
})
export class MempoolActionComponent implements OnInit, OnDestroy {

  public mempoolAction;
  public mempoolActionList = [];

  public networkAction;
  public networkActionList = [];

  public onDestroy$ = new Subject();

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit(): void {

    // triger action and get mempool data
    this.store.dispatch({
      type: 'MEMPOOL_ACTION_LOAD',
    });

    // wait for data changes from redux
    this.store.select('mempoolAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.mempoolAction = data;
      });

    // TODO: temoporary, remove
    this.store.dispatch({
      type: 'NETWORK_ACTION_LOAD',
      payload: '',
    });

    // TODO: temoporary, remove
    this.store.select('networkAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.networkAction = data;
        this.networkActionList = data.ids.map(id => ({ id, ...data.entities[id] }));
      });

  }

  networkNextPage() {
    console.log('[networkNextPage]');

    this.store.dispatch({
      type: 'NETWORK_ACTION_LOAD',
      payload: {
        previous_page: true
      },
    });

  }

  networkCursorPage() {
    console.log('[networkIndexPage]');

    this.store.dispatch({
      type: 'NETWORK_ACTION_LOAD',
      payload: {
        previous_page: true
      },
    });

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
