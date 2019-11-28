import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  private router
  public onDestroy$ = new Subject()

  constructor(
    public store: Store<any>,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    // wait for data changes from redux    
    this.store.select('storageAction')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.storageAction = data

      })

    // get url params  
    this.router = this.route.params.subscribe(params => {

      // triger action and get blocks data
      this.store.dispatch({
        type: 'STORAGE_ACTION_LOAD',
        payload: {
          blockId: params['blockId']
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
