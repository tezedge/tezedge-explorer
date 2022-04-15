import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StateResourcesState } from '@resources/state-resources/state-resources/state-resources.index';

@Component({
  selector: 'app-state-resources-overview',
  templateUrl: './state-resources-overview.component.html',
  styleUrls: ['./state-resources-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateResourcesOverviewComponent implements OnChanges {

  @Input() state: StateResourcesState;

  filteredTotalTime: number;
  filteredCount: number;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.state && changes.state.currentValue !== changes.state.previousValue) {
      this.filteredTotalTime = this.state.filteredGroups.reduce((acc, curr) => acc + curr.totalTime, 0);
      this.filteredCount = this.state.filteredGroups.reduce((acc, curr) => acc + curr.count, 0);
    }
  }
}
