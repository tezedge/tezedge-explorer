import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-settings-node',
  templateUrl: './settings-node.component.html',
  styleUrls: ['./settings-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsNodeComponent implements OnInit {

  settingsNodeApi;
  settingsNodeEntities;
  stateEntities;

  constructor(private store: Store<any>,
              private router: Router,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.select('settingsNode')
      .pipe(untilDestroyed(this))
      .subscribe(state => {
        if (state.api && state.api.id) {
          this.settingsNodeApi = state.entities[state.api.id];
          this.settingsNodeEntities = state.ids.map(id => state.entities[id]);
          this.stateEntities = state.entities;
          this.cdRef.detectChanges();
        }
      });
  }

  onOpeningNodeSelect(): void {
    this.store.dispatch({ type: 'SETTINGS_NODE_LOAD' });
  }

  nodeSelectChange(id) {
    this.store.dispatch({
      type: 'APP_NODE_CHANGE',
      payload: { api: { id } },
    });
  }

  nodeSandboxAdd() {
    this.router.navigate(['/sandbox']);
  }

  nodeSandboxStop() {
    this.store.dispatch({
      type: 'SANDBOX_NODE_STOP',
      payload: '',
    });
  }
}
