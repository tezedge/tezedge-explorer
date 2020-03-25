import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-network-action',
  templateUrl: './network-action.component.html',
  styleUrls: ['./network-action.component.css']
})
export class NetworkActionComponent implements OnInit {

  public networkAction
  public networkActionList
  public networkActionShow

  public tableDataSource
  public onDestroy$ = new Subject()

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit(): void {


    // wait for data changes from redux
    this.store.select('networkAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.networkAction = data;
        
        this.networkActionShow = data.ids.length > 0 ? true : false;
        this.networkActionList = data.ids.map(id => ({ id, ...data.entities[id] }));

        this.tableDataSource = new MatTableDataSource<any>(this.networkActionList);
        this.tableDataSource.paginator = this.paginator;

      });

    // triger action and get network data
    this.store.dispatch({
      type: 'NETWORK_ACTION_LOAD',
    });

  }

  ngOnDestroy() {

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
