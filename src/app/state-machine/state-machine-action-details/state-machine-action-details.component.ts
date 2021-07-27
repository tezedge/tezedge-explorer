import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { Observable, tap } from 'rxjs';
import { selectStateMachine } from '@state-machine/state-machine/state-machine.reducer';
import { NgxObjectDiffService } from 'ngx-object-diff';
import { StateMachine } from '@shared/types/state-machine/state-machine.type';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { StateMachineAction } from '@shared/types/state-machine/state-machine-action.type';
import { selectActiveNode } from '@settings/settings-node.reducer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-state-machine-action-details',
  templateUrl: './state-machine-action-details.component.html',
  styleUrls: ['./state-machine-action-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMachineActionDetailsComponent implements OnInit {

  readonly tabs = ['CONTENT', 'STATE', 'DIFFS'];

  activeTab: string = 'STATE';
  stateMachine$: Observable<StateMachine>;
  currentAction: StateMachineAction;
  stateDifferences: string;

  private api: string;

  constructor(private store: Store<State>,
              private objectDiff: NgxObjectDiffService,
              private cdRef: ChangeDetectorRef,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.objectDiff.setOpenChar('');
    this.objectDiff.setCloseChar('');

    this.store.select(selectActiveNode)
      .pipe(untilDestroyed(this))
      .subscribe(node => this.api = node.http);

    this.stateMachine$ = this.store.select(selectStateMachine)
      .pipe(
        filter(state => this.currentAction !== state.activeAction && state.activeAction !== null),
        tap(state => this.stateDifferences = this.formatHTML(state))
      );
  }

  private formatHTML(state: StateMachine): string {
    this.currentAction = state.activeAction;
    const prevAction = state.actionTable.entities[state.activeAction.id - 1];
    if (this.currentAction.originalId !== 1 && !prevAction) {
      // TODO: diff should happen on the backend and we should not do these tricks here
      this.api = 'http://prod.tezedge.com:18732/dev/shell/automaton/state?action_id=' + (this.currentAction.originalId - 1);
      this.http.get<any>(this.api).subscribe(response => {
        this.stateDifferences = this.getDifferences(this.currentAction.state, response);
        this.cdRef.detectChanges();
      });
      return this.stateDifferences;
    } else if (this.currentAction.originalId === 1) {
      return 'No differences';
    }

    return this.getDifferences(this.currentAction.state, prevAction.state);
  }

  private getDifferences(currentActionState: any, prevActionState: any): string {
    const diff = this.objectDiff.diff(prevActionState || {}, currentActionState || {});
    let innerHTML = this.objectDiff.toJsonDiffView(diff);
    const findAllOccurrences = (str, substr) => {
      str = str.toLowerCase();
      const result = [];
      let idx = str.indexOf(substr);
      while (idx !== -1) {
        result.push(idx);
        idx = str.indexOf(substr, idx + 1);
      }
      return result;
    };
    const delEndingTag = '</del>';
    const insEndingTag = '</ins>';
    innerHTML = innerHTML
      .split('</del><span>,</span>').join(delEndingTag)
      .split('</ins><span>,</span>').join(insEndingTag)
      .split('<span>,</span>').join('')
      .split('<span></span>\n').join('');
    const delStart = '<del class="diff diff-key">';
    const insStart = '<ins class="diff diff-key">';
    const insDiffStart = '<ins class="diff">';
    const spanInside = '<span>: </span>';
    findAllOccurrences(innerHTML, delStart).reverse().forEach(index => {
      const delContentStartIdx = index + delStart.length;
      const spanDelEndLimit = delContentStartIdx + innerHTML.substr(delContentStartIdx).indexOf(spanInside) + spanInside.length;
      const delContentEndIdx = delContentStartIdx + innerHTML.substr(delContentStartIdx).indexOf(delEndingTag);
      const oldValueTag = '<div class="old-value">' + innerHTML.substring(spanDelEndLimit, delContentEndIdx) + '</div>';
      innerHTML = innerHTML.substring(0, spanDelEndLimit) + oldValueTag + innerHTML.substring(delContentEndIdx);
    });
    findAllOccurrences(innerHTML, delStart).reverse().forEach(index => {
      const delContentStartIdx = index + delStart.length;
      const delContentEndIdx = delContentStartIdx + innerHTML.substr(delContentStartIdx).indexOf(delEndingTag);
      const nextInsTagStart = delContentEndIdx + innerHTML.substr(delContentEndIdx).indexOf(delEndingTag) + delEndingTag.length + 1;
      const nextInsTagEnd = delContentEndIdx + innerHTML.substr(delContentEndIdx).indexOf(insEndingTag) + insEndingTag.length;
      const nextInsTag = innerHTML.substring(nextInsTagStart, nextInsTagEnd);
      innerHTML = innerHTML.substring(0, delContentEndIdx) + nextInsTag + innerHTML.substring(delContentEndIdx);
      innerHTML = innerHTML.substring(0, nextInsTagStart + nextInsTag.length - 1) + innerHTML.substring(nextInsTagEnd + nextInsTag.length);
    });
    findAllOccurrences(innerHTML, insStart).reverse().forEach(index => {
      const insContentStartIdx = index + insStart.length;
      const spanInsEndLimit = innerHTML.substr(insContentStartIdx).indexOf(spanInside) + spanInside.length;
      innerHTML = innerHTML.substring(0, insContentStartIdx) + innerHTML.substring(insContentStartIdx + spanInsEndLimit);
    });
    // search which has del right near div.diff-level and wrap all dels inside a div
    // this covers case when multiple entries has been replaced by a single new one
    const diffLevel = '<div class="diff-level"><del';
    findAllOccurrences(innerHTML, diffLevel).reverse().forEach(index => {
      const divContentStart = index + diffLevel.length - 4;
      const indexOfInsDiffStart = innerHTML.substr(divContentStart).indexOf(insDiffStart);
      const indexOfIns = innerHTML.substr(divContentStart).indexOf('<ins');
      if (indexOfInsDiffStart !== -1 && indexOfInsDiffStart === indexOfIns) {
        const insTagStart = divContentStart + indexOfInsDiffStart;
        innerHTML = innerHTML.substring(0, divContentStart)
          + '<div class="group-del">'
          + innerHTML.substring(divContentStart, insTagStart)
          + '</div>'
          + innerHTML.substring(insTagStart);
      }
    });
    return innerHTML;
  }
}
