import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { ChainServerComponent } from '../chain/chain-server/chain-server.component';
import { ChainConfigComponent } from '../chain/chain-config/chain-config.component';
import { ChainWalletsComponent } from '../chain/chain-wallets/chain-wallets.component';
import { ChainBakingComponent } from '../chain/chain-baking/chain-baking.component';
import { ChainOtherComponent } from '../chain/chain-other/chain-other.component';
import { ChainFinishComponent } from '../chain/chain-finish/chain-finish.component';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent implements OnInit, OnDestroy{
  @ViewChild(ChainServerComponent) chainServer: ChainServerComponent;
  @ViewChild(ChainConfigComponent) chainConfig: ChainConfigComponent;
  @ViewChild(ChainWalletsComponent) chainWallets: ChainWalletsComponent;
  @ViewChild(ChainBakingComponent) chainBaking: ChainBakingComponent;
  @ViewChild(ChainOtherComponent) chainOther: ChainOtherComponent;
  @ViewChild(ChainFinishComponent) chainFinish: ChainFinishComponent;

  @ViewChild('stepper') stepper: MatStepper;
  
  onDestroy$ = new Subject();
  showLoading: boolean;
  showError: boolean;

  constructor(
    private store: Store<any>, 
    private router: Router, 
    private actions$: Actions, 
    private el: ElementRef) { }

  ngOnInit(): void {
    // hide sidenav and toolbar
    this.toggleSidenavVisibility(false);

    // Subscribe to success actions - to proceed to next step
    this.actions$.pipe(
      ofType(
        'CHAIN_SERVER_FORM_SUBMIT_SUCCESS',
        'CHAIN_WALLETS_SUBMIT_SUCCESS',
        'CHAIN_WALLETS_SUBMIT_SUCCESS'
        ),
      takeUntil(this.onDestroy$),
      tap(() => {
        this.goToNextStep();
      })
    ).subscribe();

    // Subscribe to the store to get the loading indicator flag
    this.store.select('sandbox')
    .pipe(takeUntil(this.onDestroy$))
    .subscribe((store) => {
      this.showLoading = store.showLoading;
      this.showError = store.showError;
    });
  }

  submitCurrentStep(){
    switch(this.stepper.selected.label){
      case 'SERVER': {
        if(!this.chainServer.chainServerForm.invalid){
          this.store.dispatch({
            type: 'CHAIN_SERVER_FORM_SUBMIT',
            payload: this.chainServer.chainServerForm.value,
          });
        } else {
          // scroll to first invalid control
          this.scrollToFirstInvalidControl();
        }
        break;
      }
      case 'WALLETS': { 
        this.store.dispatch({
          type: 'CHAIN_WALLETS_SUBMIT',
          payload: this.chainWallets.wallets,
        });
        break; 
      }
      case 'CHAIN': {
        if(!this.chainConfig.chainConfigForm.invalid){
          this.store.dispatch({
            type: 'CHAIN_CONFIG_FORM_SUBMIT',
            payload: this.chainConfig.chainConfigForm.value,
          });
        } else {
          // scroll to first invalid control
          this.scrollToFirstInvalidControl();
        }
        break;
      }
      // case 'BAKING': { break; }
      // case 'OTHER': { break; }
      // case 'FINISH': { break; }
    }
  }

  goToNextStep(){
    this.stepper.selected.completed = true;
    this.stepper.next();
    window.scroll(0,0);
  }

  closePage(){
    this.toggleSidenavVisibility(true);
    this.router.navigate(['/chain']);
  }
  
  uploadConfig(){
    // TODO
  }

  toggleSidenavVisibility(isVisible: boolean){
    this.store.dispatch({
      type: 'SIDENAV_VISIBILITY_CHANGE',
      payload: isVisible,
    });
    this.store.dispatch({
      type: 'TOOLBAR_VISIBILITY_CHANGE',
      payload: isVisible,
    });
  }

  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
      ".form-field .ng-invalid:not(.mat-form-field-invalid)"
    );

    window.scroll({
      top: this.getTopOffset(firstInvalidControl),
      left: 0,
      behavior: "smooth"
    });
  }

  getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 50;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }

  ngOnDestroy() {
    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
