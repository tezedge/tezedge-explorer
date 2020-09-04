import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { initializeWallet, getWallet, keys } from 'tezos-wallet';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chain-wallets',
  templateUrl: './chain-wallets.component.html',
  styleUrls: ['./chain-wallets.component.scss']
})
export class ChainWalletsComponent implements OnInit, OnDestroy {
  @Input() isReadonly?: boolean;
  onDestroy$ = new Subject();
  displayedColumns = ['publicKey', 'baking', 'balance']

  wallets: any[];

  constructor(private store: Store<any>) { }

  ngOnInit(): void {
		// disable form if isReadonly is passed
		if(this.isReadonly){
			// this.chainWalletsForm.disable();
    }
    
    // subscribe to wallets store
    this.store.select('chainWallets')
		.pipe(takeUntil(this.onDestroy$))
		.subscribe(store => {
      this.wallets = store.wallets;

      if(!this.isReadonly && !this.wallets.length){
        // Generate 5 default wallets for table
        for(let i=1; i<=5; i++){
          this.addWallet();
        }
      }
    });

  }

  // Adds wallet to store
  addWallet(){
    // calling tezos-wallet library function
    const wallet = keys();
    // dispatch wallet to store
    this.store.dispatch({
      type: 'CHAIN_WALLETS_ADD_WALLET',
      payload: wallet,
    });
  }

  ngOnDestroy() {
    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
