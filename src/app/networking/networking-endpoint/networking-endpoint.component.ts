import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-networking-endpoint',
  templateUrl: './networking-endpoint.component.html',
  styleUrls: ['./networking-endpoint.component.css']
})
export class NetworkingEndpointComponent implements OnInit {

  public networkingEndpoint
  public settings
  public onDestroy$ = new Subject()

  constructor(
    public store: Store<any>,
  ) { }


  ngOnInit() {

    // wait for data changes from redux    
    this.store.select('networkingEndpoint')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.networkingEndpoint = data;

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
