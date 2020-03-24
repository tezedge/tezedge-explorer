import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {

  public onDestroy$ = new Subject()

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {

    // start ws stream
    this.store.dispatch({
      type: 'network_OPEN',
    })
  }

  ngOnDestroy() {

    // stop ws stream 
    this.store.dispatch({
      type: 'network_CLOSE',
    })

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }
}
