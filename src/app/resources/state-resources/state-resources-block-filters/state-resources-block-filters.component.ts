import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import {
  selectStateResources,
  StateResourcesState
} from '@resources/state-resources/state-resources/state-resources.index';
import {
  STATE_RESOURCES_CHANGE_ACTIVE_ROUND,
  STATE_RESOURCES_LOAD_BLOCKS,
  STATE_RESOURCES_NODE_LIFETIME_DATA,
  StateResourcesChangeActiveRound,
  StateResourcesLoadBlocks,
  StateResourcesNodeLifetimeData
} from '@resources/state-resources/state-resources/state-resources.actions';
import { StateResourcesBlockData } from '@shared/types/resources/state/state-resources-block-data.type';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { selectNetworkLastAppliedBlockLevel } from '@monitoring/network-stats/network-stats.reducer';

@UntilDestroy()
@Component({
  selector: 'app-state-resources-block-filters',
  templateUrl: './state-resources-block-filters.component.html',
  styleUrls: ['./state-resources-block-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateResourcesBlockFiltersComponent implements OnInit {

  formGroup: FormGroup;
  state: StateResourcesState;
  blocksWithSameLevel: StateResourcesBlockData[] = [];
  activeBlock: StateResourcesBlockData;
  private activeBlockIndex: number;
  private routedBlockLevel: number;
  private routedBlockRound: number;
  private lastAppliedBlock: number;

  constructor(private router: Router,
              private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private zone: NgZone,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.listenToStateChange();
    this.listenToRouteChange();
    this.listenToLastBlockChange();
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      block: new FormControl(),
    });
  }

  private listenToRouteChange(): void {
    this.store.select(getMergedRoute)
      .pipe(untilDestroyed(this))
      .subscribe((route: MergedRoute) => {
        if (route.params.level) {
          const newLevel = Number(route.params.level);
          this.routedBlockRound = Number(route.params.round);
          if (this.routedBlockLevel !== newLevel) {
            this.routedBlockLevel = newLevel;
            this.formGroup.get('block').setValue(this.routedBlockLevel);
            this.search();
          }
        } else {
          this.routedBlockLevel = null;
          this.routedBlockRound = null;
          this.formGroup.get('block').setValue(this.routedBlockLevel);
        }
      });
  }

  private listenToStateChange(): void {
    this.store.select(selectStateResources)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((state: StateResourcesState) => {
        this.state = state;
        this.activeBlock = state.activeBlock;
        this.activeBlockIndex = this.state.blocks.indexOf(this.state.activeBlock);
        this.blocksWithSameLevel = this.state.blocks.filter(b => b.blockLevel === this.activeBlock?.blockLevel);
        this.cdRef.detectChanges();
      });
  }

  private search(): void {
    this.store.dispatch<StateResourcesLoadBlocks>({
      type: STATE_RESOURCES_LOAD_BLOCKS,
      payload: { level: this.routedBlockLevel, round: this.routedBlockRound }
    });
  }

  loadPreviousBlock(): void {
    const prevBlock = this.state.blocks[this.activeBlockIndex - 1];
    if (prevBlock.blockLevel === this.activeBlock.blockLevel) {
      this.changeActiveRound(prevBlock.blockLevel, prevBlock.blockRound);
      return;
    }
    this.formGroup.get('block').patchValue(prevBlock.blockLevel);
    this.onFormSubmit(prevBlock.blockRound);
  }

  loadNextBlock(): void {
    const nextBlock = this.state.blocks[this.activeBlockIndex + 1];
    if (nextBlock.blockLevel === this.activeBlock.blockLevel) {
      this.changeActiveRound(nextBlock.blockLevel, nextBlock.blockRound);
      return;
    }
    this.formGroup.get('block').patchValue(nextBlock.blockLevel);
    this.onFormSubmit(nextBlock.blockRound);
  }

  changeActiveRound(level: number, round: number): void {
    if (this.routedBlockRound !== round) {
      this.formGroup.get('block').patchValue(level);
      this.router.navigate(['resources', 'state', level, round]);
      this.store.dispatch<StateResourcesChangeActiveRound>({
        type: STATE_RESOURCES_CHANGE_ACTIVE_ROUND,
        payload: { level, round }
      });
    }
  }

  onFormSubmit(round: number = 0): void {
    const level = this.formGroup.get('block').value.toString().split(' ').join('');
    if (level && (this.routedBlockLevel !== Number(level) || this.routedBlockRound !== round)) {
      this.router.navigate(['resources', 'state', level, round]);
    }
  }

  getNodeLifetimeStats(): void {
    this.router.navigate(['resources', 'state']);
    this.store.dispatch<StateResourcesNodeLifetimeData>({ type: STATE_RESOURCES_NODE_LIFETIME_DATA });
  }

  getMostRecentBlockStats(): void {
    this.router.navigate(['resources', 'state', this.lastAppliedBlock, 0]);
  }

  private listenToLastBlockChange(): void {
    this.store.select(selectNetworkLastAppliedBlockLevel).pipe(
      untilDestroyed(this),
      filter(Boolean),
      distinctUntilChanged()
    ).subscribe((currentBlock: number) => {
      this.lastAppliedBlock = currentBlock;
    });
  }
}
