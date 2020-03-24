import { Component, OnInit, NgZone, ViewChild, HostListener } from '@angular/core'
import { Router } from '@angular/router';
import { Store } from '@ngrx/store'
import { environment } from '../environments/environment';
import { MatSidenav } from "@angular/material/sidenav";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public app
  public settings
  public networkEndpoint
  public innerWidth;
  public isMobile = false;

  @ViewChild('sidenav') sidenav: MatSidenav;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.isMobile = window.innerWidth < 600 ? true : false;
  }

  constructor(
    public store: Store<any>,
    public router: Router,
    public zone: NgZone
  ) {

    // get inner windows width
    this.innerWidth = window.innerWidth;
    this.isMobile = window.innerWidth < 600 ? true : false;
  }

  ngOnInit() {

    // select store data
    this.store.select('app')
      .subscribe(data => {
        this.app = data;
    });

    // wait for data changes from redux
    this.store.select('settings')
      .subscribe(data => {
        this.settings = data;
      })

    // wait for data changes from redux
    this.store.select('networkEndpoint')
      .subscribe(data => {
        this.networkEndpoint = data;
      })

    // dispatch inner width
    this.store.dispatch({
      type: 'APP_WINDOW',
      payload: {
        width: this.innerWidth
      },
    });

  }

}
