import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil, filter } from 'rxjs/operators'


@Component({
  selector: 'app-storage-action',
  templateUrl: './storage-action.component.html',
  styleUrls: ['./storage-action.component.css']
})
export class StorageActionComponent implements OnInit {

  public block
  public blockId
  public storageBlock
  public storageAction
  public storageActionList
  public storageActionBlocks
  public storageActionShow
  public tableDataSource = []
  public router
  public onDestroy$ = new Subject()

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public store: Store<any>,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    // wait for data changes from redux
    this.store.select('storageAction')
      .pipe(
        takeUntil(this.onDestroy$),
        filter(data => data.entities.length !== 0)
      )
      .subscribe(data => {

        this.storageAction = data
        this.storageActionShow = data.entities.length > 0 ? true : false;

        this.storageActionBlocks = data.blocks;

        this.storageActionBlocks.map(block => {

          console.log('[block]', block );
          const tableData  = data.ids[block].map(id => ({ ...data.entities[id] }));
          this.tableDataSource[block] = new MatTableDataSource<any>(tableData);
          this.tableDataSource[block].paginator = this.paginator;
        
        });

      });

    // wait for data changes from redux
    this.store.select('storageBlock')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.storageBlock = data

      });

    // get url params
    // TODO: unsubscribe after destroy
    this.router = this.route.params.subscribe(params => {

      // get block Id
      this.blockId = params['blockId'];

      // triger action and get blocks data
      this.store.dispatch({
        type: 'STORAGE_ACTION_LOAD',
        payload: {
          blockId: this.blockId
        }
      });

    });


  }


  ngOnDestroy() {

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
