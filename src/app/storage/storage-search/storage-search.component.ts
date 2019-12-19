import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-storage-search',
  templateUrl: './storage-search.component.html',
  styleUrls: ['./storage-search.component.css']
})
export class StorageSearchComponent implements OnInit {

  public storageSearchInput="";
  
  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {
  }

  valueChange(input) {
    
    // dispatch action 
    this.store.dispatch({
      type: 'STORAGE_SEARCH',
      payload: input
    });
    
    console.log('[storageSearchInput]', this.storageSearchInput, input);
  }

}
