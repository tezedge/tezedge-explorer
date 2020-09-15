import { Component, OnInit, NgZone, ViewChild, HostListener } from '@angular/core'
import { Router } from '@angular/router';
import { Store } from '@ngrx/store'
import { MatSidenav } from "@angular/material/sidenav";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public app;
  public innerWidth;
  public isMobile = false;

  @ViewChild('sidenav') sidenav: MatSidenav;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.isMobile = window.innerWidth < 600 ? true : false;
  }
  onDestroy$ = new Subject();
  pendingTransactions: any[];

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

    // dispatch inner width
    this.store.dispatch({
      type: 'APP_WINDOW',
      payload: {
        width: this.innerWidth
      },
    });

    // subscribe to mempool to get pending transactions
    this.store.select('mempoolAction')
    .pipe(takeUntil(this.onDestroy$))
    .subscribe((mempool) => {
      this.pendingTransactions = mempool.ids;
      // this.pendingTransactions = mempool.ids.filter(id => mempool.entities[id].type == 'applied' || mempool.entities[id].type == 'unprocessed')
    });
  }

  // change app theme
  changeTheme(theme) {

    // TODO: enabled once we have white theme ready
    // this.store.dispatch({
    //   type: 'APP_THEME_CHANGE',
    //   payload: theme,
    // });

    // // change theme
    // (document.getElementById('app-style-theme') as any).href = 'styles.' + theme + '.css';

  }

  sandboxBakeBlock() {
    if(this.app.statusbar.sandbox){
      this.store.dispatch({
        type: 'SANDBOX_BAKE_BLOCK',
      });
    }
  }

  ngOnDestroy() {
    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
