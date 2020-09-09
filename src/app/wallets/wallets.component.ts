import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss']
})
export class WalletsComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject();
  displayedColumns = ['address', 'baking', 'contracts', 'transactions', 'index', 'balance'];
  wallets: any;

  constructor(private store: Store<any>) { }

  ngOnInit(): void {
    this.store.dispatch({type: 'WALLETS_LIST_INIT'});

    this.store.select('wallets')
    .pipe(takeUntil(this.onDestroy$))
		.subscribe(store => {
      // TODO replace with real (initialized) wallets
      this.wallets = store.initWallets;
    });
  }

  ngOnDestroy() {
    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
