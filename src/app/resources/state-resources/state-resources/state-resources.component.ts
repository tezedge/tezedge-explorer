import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '@app/app.index';
import {
  STATE_RESOURCES_CLOSE,
  STATE_RESOURCES_LOAD,
  StateResourcesClose,
  StateResourcesLoad
} from '@resources/state-resources/state-resources/state-resources.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';
import { selectStateResources, StateResourcesState } from '@resources/state-resources/state-resources/state-resources.index';
import { StateResourcesActionGroup } from '@shared/types/resources/state/state-resources-action-group.type';

@UntilDestroy()
@Component({
  selector: 'app-state-resources',
  templateUrl: './state-resources.component.html',
  styleUrls: ['./state-resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateResourcesComponent implements OnInit, OnDestroy {

  state: StateResourcesState;
  miniGraphRef: ElementRef;
  expandedPanel: boolean = true;

  @ViewChild('miniGraph', { read: ElementRef }) set miniGraph(content: ElementRef) {
    if (content) {
      this.miniGraphRef = content;
      this.cdRef.detectChanges();
    }
  }

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  readonly trackGroups = (index: number, group: StateResourcesActionGroup) => group.groupName;

  ngOnInit(): void {
    this.listenToStateChange();
    this.store.dispatch<StateResourcesLoad>({ type: STATE_RESOURCES_LOAD });
  }

  private listenToStateChange(): void {
    this.store.pipe(
      untilDestroyed(this),
      select(selectStateResources),
      filter(value => value.groups.length > 0),
    ).subscribe(state => {
      this.state = state;
      this.cdRef.detectChanges();
    });
  }

  togglePanel(): void {
    this.expandedPanel = !this.expandedPanel;
  }

  ngOnDestroy(): void {
    this.store.dispatch<StateResourcesClose>({ type: STATE_RESOURCES_CLOSE });
  }
}
