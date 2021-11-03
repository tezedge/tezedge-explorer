import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StateResourcesState } from '@resources/state-resources/state-resources/state-resources.index';
import { ADD_INFO, InfoAdd } from '@app/layout/error-popup/error-popup.actions';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';

@Component({
  selector: 'app-state-resources-overview',
  templateUrl: './state-resources-overview.component.html',
  styleUrls: ['./state-resources-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateResourcesOverviewComponent implements OnChanges {

  @Input() state: StateResourcesState;

  filteredTotalTime: number;
  filteredMeanTime: number;
  filteredCount: number;

  constructor(private store: Store<State>) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.state && changes.state.currentValue !== changes.state.previousValue) {
      this.filteredTotalTime = this.state.filteredGroups.reduce((acc, curr) => acc + curr.totalTime, 0);
      this.filteredMeanTime = this.state.filteredGroups.reduce((acc, curr) => acc + curr.meanTime, 0) / this.state.filteredGroups.length;
      this.filteredCount = this.state.filteredGroups.reduce((acc, curr) => acc + curr.count, 0);
    }
  }

  copyHashToClipboard(hash: string): void {
    this.store.dispatch<InfoAdd>({ type: ADD_INFO, payload: 'Copied to clipboard: ' + hash });
  }
}
