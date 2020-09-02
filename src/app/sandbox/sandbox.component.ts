import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

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
export class SandboxComponent implements OnInit {
  @ViewChild(ChainServerComponent) chainServer: ChainServerComponent;
  @ViewChild(ChainConfigComponent) chainConfig: ChainConfigComponent;
  @ViewChild(ChainWalletsComponent) chainWallets: ChainWalletsComponent;
  @ViewChild(ChainBakingComponent) chainBaking: ChainBakingComponent;
  @ViewChild(ChainOtherComponent) chainOther: ChainOtherComponent;
  @ViewChild(ChainFinishComponent) chainFinish: ChainFinishComponent;
  
  constructor(private store: Store<any>, private router: Router) { }

  ngOnInit(): void {
    // hide sidenav and toolbar
    this.toggleSidenavVisibility(false);
  }

  stepChanged(stepper: MatStepper){
    if(!stepper.selected.hasError){
      switch(stepper.selected.label){
        case 'SERVER': {
          this.store.dispatch({
            type: 'CHAIN_SERVER_FORM_SUBMIT',
            payload: this.chainServer.chainServerForm.value,
          });
          break;
        }
        case 'CHAIN': {
          this.store.dispatch({
            type: 'CHAIN_CONFIG_FORM_SUBMIT',
            payload: this.chainConfig.chainConfigForm.value,
          });
          break;
        }
        // case 'WALLETS': { break; }
        // case 'BAKING': { break; }
        // case 'OTHER': { break; }
        // case 'FINISH': { break; }
      }
    }
    window.scroll(0,0);
  }

  nextStep(stepper: MatStepper){
    stepper.next();
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
}
