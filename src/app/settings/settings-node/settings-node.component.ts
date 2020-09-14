import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store'
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-node',
  templateUrl: './settings-node.component.html',
  styleUrls: ['./settings-node.component.scss']
})
export class SettingsNodeComponent implements OnInit {

  public app;
  public settingsNodeApi;
  public settingsNodeEntities;
  public stateEntities;

  // public selected = 'node-0';

  constructor(
    public store: Store<any>,
    private router: Router
  ) { }

  ngOnInit(): void {

    // wait for data changes from redux
    this.store.select('settingsNode')
      .subscribe(state => {
        this.settingsNodeApi = state.entities[state.api.id];
        this.settingsNodeEntities = state.ids.map(id => state.entities[id]);
        this.stateEntities = state.entities;
      });

    // select store data
    this.store.select('app')
      .subscribe(data => {
        this.app = data;
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
    this.router.navigate(['/sandbox']);
  }

  nodeSandboxStop() {

    // stop sandbox node 
    this.store.dispatch({
      type: 'SANDBOX_NODE_STOP',
      payload: '',
    });

  }
}
