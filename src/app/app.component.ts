import { Component, OnInit, NgZone, ViewChild, HostListener } from '@angular/core'
import { Router } from '@angular/router';
import { Store } from '@ngrx/store'
import { environment } from '../environments/environment';
import { MatSidenav } from "@angular/material";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public app
  public innerWidth;

  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

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

    // get inner windows width
    this.innerWidth = window.innerWidth;

    // dispatch inner width  
    this.store.dispatch({
      type: 'APP_WINDOW',
      payload: {
        width: this.innerWidth
      },
    });

  }

}
