import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-sandbox-status-bar',
  templateUrl: './sandbox-status-bar.component.html',
  styleUrls: ['./sandbox-status-bar.component.scss']
})
export class SandboxStatusBarComponent implements OnInit {
  settingsNode: any;
  nodeHeaderLevel: any;

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {

    // this.store.select('settingsNode')
    // .subscribe(state => {
    //   this.settingsNode = state;
    //   this.nodeHeaderLevel = state.entities[state.activeNode.id]?.header?.level;
    // });
  }

  sandboxWalletInit() {

    this.store.dispatch({
      type: 'SANDBOX_WALLET_INIT',
    });

  }

  sandboxActivateProtocol() {

    this.store.dispatch({
      type: 'SANDBOX_ACTIVATE_PROTOCOL',
    });

  }

  sandboxBakeBlock() {

    this.store.dispatch({
      type: 'SANDBOX_BAKE_BLOCK',
    });

  }

  sandboxNodeStop() {

    this.store.dispatch({
      type: 'SANDBOX_NODE_STOP',
    });

  }

}
