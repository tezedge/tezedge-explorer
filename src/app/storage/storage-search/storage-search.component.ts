import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { Router } from '@angular/router';

@Component({
  selector: 'app-storage-search',
  templateUrl: './storage-search.component.html',
  styleUrls: ['./storage-search.component.css']
})
export class StorageSearchComponent implements OnInit {

  public storageSearchInput = "";

  constructor(
    public store: Store<any>,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  valueChange(input) {

    const searchInput = input;
    
    // process block ID
    const blockPrefix = input.substr(0, 1);
    if (blockPrefix === "B" && input.length === 51) {
      
      console.log('[storageSearchInput]', this.storageSearchInput, input, input.length);

      // clean search
      this.storageSearchInput = "";

      // change route 
      this.store.dispatch({
        type: 'STORAGE_SEARCH',
        payload: searchInput,
      });

      // this.router.navigate(['/storage', input]);
    }

    // porcess address id
    const addressPrefix = input.substr(0, 3);
    if ((addressPrefix === "tz1" || addressPrefix === "tz2" || addressPrefix === "tz3" || addressPrefix === "KT1") && input.length === 36) {

      console.log('[storageSearchInput]', this.storageSearchInput, input, input.length);

      // clean search
      this.storageSearchInput = "";

      // change route 
      this.store.dispatch({
        type: 'STORAGE_SEARCH',
        payload: searchInput,
      });

      // this.router.navigate(['/storage', input]);
    }

  }

}
