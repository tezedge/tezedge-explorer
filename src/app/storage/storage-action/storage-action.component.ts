import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'


@Component({
  selector: 'app-storage-action',
  templateUrl: './storage-action.component.html',
  styleUrls: ['./storage-action.component.css']
})
export class StorageActionComponent implements OnInit {

  public storageAction

  public onDestroy$ = new Subject()

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {

    // wait for data changes from redux    
    this.store.select('storageAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.storageAction = data

      })

    // triger action and get blocks data
    this.store.dispatch({
      type: 'STORAGE_BLOCK_ACTION_LOAD',
    });

  }


  ngOnDestroy() {

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
