import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-network-action-detail',
  templateUrl: './network-action-detail.component.html',
  styleUrls: ['./network-action-detail.component.css']
})
export class NetworkActionDetailComponent implements OnInit {

 
  public networkActionDetail
  public onDestroy$ = new Subject()

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit(): void {

    // triger action and get network detail data
    this.store.dispatch({
      type: 'NETWORK_ACTION_DETAIL_LOAD',
    });

  }

  ngOnDestroy() {

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
