import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatSidenav } from '@angular/material/sidenav';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { State } from './app.reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  app;
  isMobile = false;

  onDestroy$ = new Subject();
  pendingTransactions: any[];

  @ViewChild('sidenav') sidenav: MatSidenav;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (window.innerWidth < 600 && !this.isMobile) {
      this.store.dispatch({ type: 'APP_MENU_STATE_CHANGE', payload: { mode: 'over' } });
      this.isMobile = true;
    } else if (window.innerWidth >= 600 && this.isMobile) {
      this.store.dispatch({ type: 'APP_MENU_STATE_CHANGE', payload: { mode: 'side' } });
      this.isMobile = false;
    }
  }

  constructor(
    public store: Store<State>,
    public router: Router,
  ) {
    // when inside Cypress testing environment, put the store on window so Cypress have access to it
    if ((window as any).Cypress) {
      (window as any).store = this.store;
    }

    // get inner windows width
    this.isMobile = window.innerWidth < 600;
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
        width: window.innerWidth
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
    if (this.app.statusbar.sandbox) {
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
