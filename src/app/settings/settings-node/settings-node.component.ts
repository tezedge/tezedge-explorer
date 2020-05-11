import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-settings-node',
  templateUrl: './settings-node.component.html',
  styleUrls: ['./settings-node.component.css']
})
export class SettingsNodeComponent implements OnInit {

  public settings
  public networkEndpoint

  public selected = 'node-0';

  public nodes = [
    {value: 'node-0', viewValue: 'ocaml.mainnet.tezedge.com'},
    {value: 'node-1', viewValue: 'rust.babylon.tezedge.com'},
    {value: 'node-2', viewValue: 'rust.carthage.tezedge.com'},
    {value: 'node-3', viewValue: 'ocaml.carthage.tezedge.com'},
  ]

  constructor(    
    public store: Store<any>,
  ) { }

  ngOnInit(): void {

    // wait for data changes from redux
    this.store.select('settings')
      .subscribe(data => {
        this.settings = data;
      })
  
    // wait for data changes from redux
    this.store.select('networkEndpoint')
      .subscribe(data => {
        this.networkEndpoint = data;
      })

  }

  nodeChange(node) {

    // change node and reload effects
    this.store.dispatch({
      type: 'SETTINGS_NODE_CHANGE',
      payload: node,
    });

  }

}
