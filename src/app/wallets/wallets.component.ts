import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss']
})
export class WalletsComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject();
  displayedColumns = ['address', 'baking', 'contracts', 'transactions', 'index', 'balance'];
  wallets: any;
  selectedWallet: any;
  transferForm: FormGroup;

  constructor(private store: Store<any>, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.store.dispatch({type: 'WALLETS_LIST_INIT'});

    this.store.select('wallets')
    .pipe(takeUntil(this.onDestroy$))
		.subscribe(store => {
      // TODO replace with real (initialized) wallets
      this.wallets = store.initWallets;
      this.selectedWallet = store.selectedWallet;
    });

    this.transferForm = this.fb.group({
			to: [''],
      amount: [''],
      fee: [''],
    });
  }

  selectWallet(wallet: any){
    // mark wallet as selected and show details
    if(this.selectedWallet?.publicKeyHash !== wallet.publicKeyHash){
      this.store.dispatch({ type: 'SELECT_WALLET', payload: wallet })
    } else {
      this.store.dispatch({ type: 'SELECT_WALLET', payload: null })
    }
  }

  closeDetails(){
    this.store.dispatch({ type: 'SELECT_WALLET', payload: null })
  }

  sendTransaction(){
    if(!this.transferForm.invalid){
      this.store.dispatch({ type: 'WALLET_TRANSACTION' });
    }
  }

  ngOnDestroy() {
    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
