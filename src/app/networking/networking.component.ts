import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
@Component({
  selector: 'app-networking',
  templateUrl: './networking.component.html',
  styleUrls: ['./networking.component.css']
})
export class NetworkingComponent implements OnInit {

  public onDestroy$ = new Subject()

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {

    // start ws stream
    this.store.dispatch({
      type: 'NETWORKING_OPEN',
    })
  }

  ngOnDestroy() {

    // stop ws stream 
    this.store.dispatch({
      type: 'NETWORKING_CLOSE',
    })

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }
}
