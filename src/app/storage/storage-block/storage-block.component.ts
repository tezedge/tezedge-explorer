import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'


@Component({
  selector: 'app-storage-block',
  templateUrl: './storage-block.component.html',
  styleUrls: ['./storage-block.component.scss']
})
export class StorageBlockComponent implements OnInit {

  public storageBlock
  public storageBlockList
  public storageBlockShow
  public tableDataSource
  public onDestroy$ = new Subject()

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {

    // wait for data changes from redux
    this.store.select('storageBlock')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.storageBlock = data;
        this.storageBlockShow = data.ids.length > 0 ? true : false;
        this.storageBlockList = data.ids.map(id => ({ id, ...data.entities[id] }));

        this.tableDataSource = new MatTableDataSource<any>(this.storageBlockList);
        this.tableDataSource.paginator = this.paginator;

    });

    // triger action and get blocks data
    this.store.dispatch({
      type: 'STORAGE_BLOCK_LOAD',
    });

  }

  ngOnDestroy() {

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
