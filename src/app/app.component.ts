import { Component, ViewEncapsulation, OnInit, NgZone } from '@angular/core'
import { Router } from '@angular/router';
import { Store } from '@ngrx/store'
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tezos-node-explorer';

  public app

  constructor(
    public store: Store<any>,
    public router: Router,
    public zone: NgZone
  ) { }

  ngOnInit() {

    // select store data 
    this.store.select('app')
      .subscribe(data => {
        this.app = data
      })

  }

}
