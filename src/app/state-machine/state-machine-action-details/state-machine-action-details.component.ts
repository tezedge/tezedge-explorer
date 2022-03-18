import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { Observable, tap } from 'rxjs';
import { selectStateMachine } from '@state-machine/state-machine/state-machine.reducer';
import { StateMachine } from '@shared/types/state-machine/state-machine.type';
import { HttpClient } from '@angular/common/http';
import { StateMachineAction } from '@shared/types/state-machine/state-machine-action.type';
import { selectActiveNode } from '@settings/settings-node.reducer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TezedgeDiffToolFactory } from '@shared/factories/tezedge-diff-tool.factory';

@UntilDestroy()
@Component({
  selector: 'app-state-machine-action-details',
  templateUrl: './state-machine-action-details.component.html',
  styleUrls: ['./state-machine-action-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMachineActionDetailsComponent implements OnInit {

  readonly tabs = ['CONTENT', 'STATE', 'DIFFS'];

  activeTab: string;
  stateMachine$: Observable<StateMachine>;
  stateDifferences: string;

  private api: string;
  private currentActionId: string;

  constructor(private store: Store<State>,
              private tezedgeDiffToolFactory: TezedgeDiffToolFactory,
              private cdRef: ChangeDetectorRef,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.store.select(selectActiveNode)
      .pipe(untilDestroyed(this))
      .subscribe(node => this.api = node.http);

    this.stateMachine$ = this.store.select(selectStateMachine)
      .pipe(
        tap(state => {
          if (this.currentActionId !== state.activeAction?.originalId && state.activeAction !== null) {
            this.currentActionId = state.activeAction.originalId;
            this.activeTab = this.activeTab || 'STATE';
            this.stateDifferences = this.formatHTML(state);
          }
        })
      );
  }

  private formatHTML(state: StateMachine): string {
    const prevAction = state.actionTable.entities[state.activeAction.id - 1];
    if (!prevAction) {
      // TODO: diff should happen on the backend and we should not do these tricks here
      const url = this.api + '/dev/shell/automaton/actions?limit=1&cursor=' + state.activeAction.originalId;
      this.http.get<StateMachineAction[]>(url).subscribe(response => {
        this.stateDifferences = this.tezedgeDiffToolFactory.getDifferences(state.activeAction.state, response[0].state);
        this.cdRef.detectChanges();
      });
      return this.stateDifferences;
    }

    return this.tezedgeDiffToolFactory.getDifferences(state.activeAction.state, prevAction.state);
  }
}
