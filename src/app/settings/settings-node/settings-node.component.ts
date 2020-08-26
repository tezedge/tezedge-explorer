import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-settings-node',
  templateUrl: './settings-node.component.html',
  styleUrls: ['./settings-node.component.scss']
})
export class SettingsNodeComponent implements OnInit {

  public settingsNodeApi;
  public settingsNodeEntities;

  // public selected = 'node-0';

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit(): void {

    // wait for data changes from redux
    this.store.select('settingsNode')
      .subscribe(state => {
        this.settingsNodeApi = state.entities[state.api.id];
        this.settingsNodeEntities = state.ids.map(id => state.entities[id]);
      });

  }

  nodeSelectOpen() {

    // check node availability
    this.store.dispatch({
      type: 'SETTINGS_NODE_LOAD',
      payload: '',
    });

  }

  nodeSelectChange(id) {

    // change node and reload effects
    this.store.dispatch({
      type: 'SETTINGS_NODE_CHANGE',
      payload: { api: { id: id } },
    });

  }

  nodeSandboxAdd() {

    // start new sandbox node 
    this.store.dispatch({
      type: 'SANDBOX_NODE_START',
      payload: '',
    });

  }

}
