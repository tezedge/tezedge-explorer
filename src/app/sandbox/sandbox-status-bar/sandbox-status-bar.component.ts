import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-sandbox-status-bar',
  templateUrl: './sandbox-status-bar.component.html',
  styleUrls: ['./sandbox-status-bar.component.css']
})
export class SandboxStatusBarComponent implements OnInit {

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {
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
