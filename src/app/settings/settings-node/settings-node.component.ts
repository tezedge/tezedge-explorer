import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SettingsNodeEntity } from '../../shared/types/settings-node/settings-node-entity.type';
import { State } from '../../app.reducers';
import { SettingsNode } from '../../shared/types/settings-node/settings-node.type';

@UntilDestroy()
@Component({
  selector: 'app-settings-node',
  templateUrl: './settings-node.component.html',
  styleUrls: ['./settings-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsNodeComponent implements OnInit {

  activeNode: SettingsNodeEntity;
  settingsNodeEntities: Array<SettingsNodeEntity>;
  sandbox: SettingsNodeEntity;

  constructor(private store: Store<State>,
              private router: Router,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getSettingsNode();
  }

  private getSettingsNode(): void {
    this.store.select((state: State) => state.settingsNode)
      .pipe(untilDestroyed(this))
      .subscribe((state: SettingsNode) => {
        if (state.activeNode && state.activeNode.id) {
          this.activeNode = state.entities[state.activeNode.id];
          this.settingsNodeEntities = state.ids.map(id => state.entities[id]);
          this.sandbox = state.entities['sandbox-carthage-tezedge'];
          this.cdRef.detectChanges();
        }
      });
  }

  onOpeningNodeSelect(): void {
    this.store.dispatch({ type: 'SETTINGS_NODE_LOAD' });
  }

  onNodeChange(id): void {
    this.store.dispatch({
      type: 'APP_NODE_CHANGE',
      payload: { activeNode: { id } },
    });
  }

  navigateToSandboxAdd(): void {
    this.router.navigate(['/sandbox']);
  }

  stopSandboxNode(): void {
    this.store.dispatch({
      type: 'SANDBOX_NODE_STOP',
      payload: '',
    });
  }
}
