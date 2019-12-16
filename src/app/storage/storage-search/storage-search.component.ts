import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-storage-search',
  templateUrl: './storage-search.component.html',
  styleUrls: ['./storage-search.component.css']
})
export class StorageSearchComponent implements OnInit {

  public storageSearchInput="";
  
  constructor() { }

  ngOnInit() {
  }

  valueChange(input) {
    console.log('[storageSearchInput]', this.storageSearchInput, input);
  }

}
