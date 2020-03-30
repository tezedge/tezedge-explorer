import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { Router } from '@angular/router';

@Component({
  selector: 'app-network-search',
  templateUrl: './network-search.component.html',
  styleUrls: ['./network-search.component.css']
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

    const searchInput = input;
    
    // process block ID
    const blockPrefix = input.substr(0, 1);
    if (blockPrefix === "B" && input.length === 51) {
      
      console.log('[networkSearchInput]', this.networkSearchInput, input, input.length);

      // clean search
      this.networkSearchInput = "";

      // change route 
      this.store.dispatch({
        type: 'NETWORK_SEARCH',
        payload: searchInput,
      });

      // this.router.navigate(['/storage', input]);
    }

    // porcess address id
    const addressPrefix = input.substr(0, 3);
    if (input.length === 36) {

      console.log('[networkSearchInput]', this.networkSearchInput, input, input.length);

      // clean search
      this.networkSearchInput = "";

      // change route 
      this.store.dispatch({
        type: 'NETWORK_SEARCH',
        payload: searchInput,
      });

      // this.router.navigate(['/storage', input]);
    }

  }

}
