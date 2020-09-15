import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss']
})
export class WalletsComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject();
  // displayedColumns = ['address', 'baking', 'contracts', 'transactions', 'index', 'balance'];
  displayedColumns = ['address', 'baking', 'balance'];
  
  wallets: any;
  walletEntities: any;

  selectedWalletId: any;
  clickedWalletId: any;

  transferForm: FormGroup;
  transferError: boolean;

  constructor(private store: Store<any>, private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.store.dispatch({type: 'WALLETS_LIST_INIT'});

    this.store.select('wallets')
    .pipe(takeUntil(this.onDestroy$))
		.subscribe(store => {
      this.wallets = store.ids.map(id => ({ id, ...store.entities[id] }))
      this.walletEntities = store.entities;

      this.selectedWalletId = store.selectedWalletId;
      this.clickedWalletId = this.clickedWalletId ? this.clickedWalletId : store.selectedWalletId;
      this.transferError = store.transferError;
    });

    this.transferForm = this.fb.group({
      to: ['', [Validators.required]],
      amount: new FormControl('', {
        validators: [
          Validators.required,
          Validators.min(0.000001),
          Validators.max(999999999),
          Validators.pattern('^[0-9]+(\.[0-9]{0,6})?'),
        ],
        updateOn: 'blur'
      }),
      fee: new FormControl('', {
        validators: [
          Validators.required,
          Validators.min(0.001),
          Validators.max(999999999),
          Validators.pattern('^[0-9]+(\.[0-9]{0,6})?'),
        ],
        updateOn: 'blur'
      }),
    });
  }

  // dispatch wallet select
  selectWallet(walletId: any){
    // mark wallet as selected and show details
    if(this.selectedWalletId !== walletId){
      this.store.dispatch({ type: 'SELECT_WALLET', payload: walletId });
    } else {
      this.store.dispatch({ type: 'SELECT_WALLET', payload: null });
    }
    this.transferForm.markAsUntouched();
  }
  
  // save clicked wallet id
  clickWallet(wallet: any){    
    if(this.selectedWalletId !== wallet.id){
      this.clickedWalletId = wallet.id;
    } else {
      this.clickedWalletId = null;
    }
    this.selectWallet(wallet.id)
  }

  // set temporary select wallet on hover
  tableMouseEnter(wallet: any){
    if(wallet.id !== this.selectedWalletId){
      this.selectWallet(wallet.id);
    }
  }

  // set clicked wallet again as selected wallet on hover leave
  tableMouseLeave(){
    console.log('leave', this.clickedWalletId, this.selectedWalletId);
    if(this.clickedWalletId !== this.selectedWalletId){
      this.selectWallet(this.clickedWalletId);
    }
  }

  closeDetails(){
    this.store.dispatch({ type: 'SELECT_WALLET', payload: null });
    this.clickedWalletId = null;
  }

  sendTransaction(){
    this.transferForm.markAllAsTouched();

    if (!this.transferForm.invalid){
      this.store.dispatch({ type: 'WALLET_TRANSACTION' });
    }
  }

  openSnackbar(message: string){
    this.snackBar.open(message, 'DISMISS', {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }

  ngOnDestroy() {
    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
