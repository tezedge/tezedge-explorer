import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { Router } from '@angular/router';

@Component({
  selector: 'app-network-search',
  templateUrl: './network-search.component.html',
  styleUrls: ['./network-search.component.scss']
})
export class NetworkSearchComponent implements OnInit {

  public networkSearchInput = "";

  constructor(
    public store: Store<any>,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  valueChange(input) {

    // porocess address
    if (input.indexOf(':') > 0) {

      // load relevant data for search
      this.store.dispatch({
        type: 'NETWORK_ACTION_LOAD',
        payload: '/' + input,
      });

    }

    // reset search
    if (input.length === 0) {

      // dispatch action for search resete
      this.store.dispatch({
        type: 'NETWORK_ACTION_LOAD',
        payload: '',
      });

      // navigate to default url
      this.router.navigate(['/network']);
    }

  }

}
