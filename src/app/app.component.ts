import {Component, OnInit, NgZone, ViewChild, HostListener, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {MatSidenav} from '@angular/material/sidenav';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public app;
  public innerWidth;
  public isMobile = false;
  public settingsNode;

  onDestroy$ = new Subject();
  pendingTransactions: any[];

  @ViewChild('sidenav') sidenav: MatSidenav;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.isMobile = window.innerWidth < 600;
  }

  constructor(
    public store: Store<any>,
    public router: Router,
    public zone: NgZone
  ) {
    // when inside Cypress testing environment, put the store on window so Cypress have access to it
    // @ts-ignore
    if (window.Cypress) {
      // @ts-ignore
      window.store = this.store;
    }

    // get inner windows width
    this.innerWidth = window.innerWidth;
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

    // wait for data changes from redux
    this.store.select('settingsNode')
      .subscribe(state => {
        this.settingsNode = state;
      });

  }

  nodeSandboxAdd() {
    this.router.navigate(['/sandbox']);
  }

  nodeSandboxStop() {
    // stop sandbox node
    this.store.dispatch({
      type: 'SANDBOX_NODE_STOP',
      payload: '',
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
