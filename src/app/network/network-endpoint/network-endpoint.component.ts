import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-network-endpoint',
  templateUrl: './network-endpoint.component.html',
  styleUrls: ['./network-endpoint.component.css']
})
export class networkEndpointComponent implements OnInit {

  public networkEndpoint
  public settings
  public onDestroy$ = new Subject()

  constructor(
    public store: Store<any>,
  ) { }


  ngOnInit() {

    // wait for data changes from redux    
    this.store.select('networkEndpoint')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.networkEndpoint = data;

      })


    // wait for data changes from redux
    this.store.select('settings')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.settings = data;
      })


  }

  ngOnDestroy() {

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
