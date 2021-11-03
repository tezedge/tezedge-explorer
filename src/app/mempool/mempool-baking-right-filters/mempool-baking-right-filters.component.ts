import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import {
  MEMPOOL_BAKING_RIGHTS_CHANGE_ROUND,
  MEMPOOL_BAKING_RIGHTS_DETAILS_LOAD,
  MEMPOOL_BAKING_RIGHTS_DISPLAYED_BLOCK_UPDATE,
  MEMPOOL_BAKING_RIGHTS_LIVE,
  MEMPOOL_BAKING_RIGHTS_LOAD,
  MEMPOOL_BAKING_RIGHTS_PAUSE,
  MempoolBakingRightsChangeRound,
  MempoolBakingRightsDetailsLoad,
  MempoolBakingRightsDisplayedBlockUpdate,
  MempoolBakingRightsLive,
  MempoolBakingRightsLoad,
  MempoolBakingRightsPause
} from '@mempool/mempool-baking-rights/mempool-baking-rights.actions';
import { mempoolBakingRightsCurrentDisplayedBlock, mempoolBakingRightsState } from '@mempool/mempool-baking-rights/mempool-baking-rights.reducer';
import { MempoolBakingRightsState } from '@shared/types/mempool/baking-rights/mempool-baking-rights-state.type';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { interval } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-mempool-baking-right-filters',
  templateUrl: './mempool-baking-right-filters.component.html',
  styleUrls: ['./mempool-baking-right-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolBakingRightFiltersComponent implements OnInit {

  formGroup: FormGroup;
  state: MempoolBakingRightsState;
  blockHashContext: { hashes: string[], activeIndex: number };

  private routedBlockHash: string;
  @ViewChild('remaining') private remainingView: ElementRef<HTMLSpanElement>;

  constructor(private router: Router,
              private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private zone: NgZone,
              private formBuilder: FormBuilder) { }

  readonly trackRounds = (index: number) => index;

  remaining = 15;
  private lastKnownDisplayedBlock: number = 0;
  private lastKnownNumberOfRounds: number = 0;

  ngOnInit(): void {
    this.initForm();
    this.listenToBlockChange();
    this.listenToStateChange();
    this.listenToRouteChange();

    // this.zone.runOutsideAngular(() => {
    //   interval(100)
    //     .pipe(untilDestroyed(this))
    //     .subscribe(() => {
    //       if (this.remaining > 0.1) {
    //         this.remaining = this.remaining - 0.1;
    //         this.remainingView.nativeElement.textContent = this.remaining.toFixed(1);
    //       }
    //     });
    // });
  }

  private listenToBlockChange(): void {
    this.store.select(mempoolBakingRightsCurrentDisplayedBlock).pipe(
      untilDestroyed(this),
      filter(Boolean),
      map(block => block.toString())
    ).subscribe((currentBlock: string) => {
      this.formGroup.get('block').setValue(currentBlock);
      if (this.routedBlockHash !== currentBlock) {
        this.routedBlockHash = currentBlock;
        this.router.navigate(['mempool', 'baking', currentBlock]);
      }
    });
  }

  private listenToRouteChange(): void {
    this.store.select(getMergedRoute)
      .pipe(untilDestroyed(this))
      .subscribe((route: MergedRoute) => {
        if (route.params.block && this.routedBlockHash !== route.params.block) {
          this.routedBlockHash = route.params.block;
          this.formGroup.get('block').setValue(this.routedBlockHash);
          this.search();
        }
      });
  }

  private listenToStateChange(): void {
    this.store.select(mempoolBakingRightsState)
      .pipe(untilDestroyed(this))
      .subscribe((state: MempoolBakingRightsState) => {
        this.state = state;
        if (this.lastKnownDisplayedBlock !== state.currentDisplayedBlock) {
          this.remaining = state.constants.minimalBlockDelay;
        } else if (this.lastKnownNumberOfRounds < state.bakingDetails.length) {
          this.remaining = state.constants.minimalBlockDelay + (state.constants.delayIncrementPerRound * (state.bakingDetails.length));
        }
        this.lastKnownDisplayedBlock = state.currentDisplayedBlock;
        this.lastKnownNumberOfRounds = state.bakingDetails.length;
        this.cdRef.detectChanges();
      });
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      block: new FormControl(),
    });
  }

  onFormSubmit(): void {
    const value = this.formGroup.get('block').value;
    if (this.routedBlockHash !== value) {
      this.router.navigate(['mempool', 'baking', value]);
    }
  }

  private search(): void {
    const value = this.formGroup.get('block').value;
    this.pause();
    this.routedBlockHash = value;
    this.store.dispatch<MempoolBakingRightsDisplayedBlockUpdate>({ type: MEMPOOL_BAKING_RIGHTS_DISPLAYED_BLOCK_UPDATE, payload: Number(value) });
    this.store.dispatch<MempoolBakingRightsLoad>({ type: MEMPOOL_BAKING_RIGHTS_LOAD });
    this.store.dispatch<MempoolBakingRightsDetailsLoad>({ type: MEMPOOL_BAKING_RIGHTS_DETAILS_LOAD });
  }

  loadPreviousBlock(): void {
    if (!isNaN(Number(this.formGroup.get('block').value))) {
      this.formGroup.get('block').patchValue(Number(this.formGroup.get('block').value) - 1);
      this.onFormSubmit();
    }
  }

  loadNextBlock(): void {
    if (!isNaN(Number(this.formGroup.get('block').value))) {
      this.formGroup.get('block').patchValue(Number(this.formGroup.get('block').value) + 1);
      this.onFormSubmit();
    }
  }

  loadLatestAppliedBlock(): void {
    this.pause();
    this.store.dispatch<MempoolBakingRightsDisplayedBlockUpdate>({ type: MEMPOOL_BAKING_RIGHTS_DISPLAYED_BLOCK_UPDATE, payload: this.state.lastAppliedBlock });
    this.store.dispatch<MempoolBakingRightsLoad>({ type: MEMPOOL_BAKING_RIGHTS_LOAD });
    this.store.dispatch<MempoolBakingRightsDetailsLoad>({ type: MEMPOOL_BAKING_RIGHTS_DETAILS_LOAD });
  }

  live(): void {
    if (!this.state.stream) {
      this.store.dispatch<MempoolBakingRightsLive>({ type: MEMPOOL_BAKING_RIGHTS_LIVE });
    }
  }

  pause(): void {
    if (this.state.stream) {
      this.store.dispatch<MempoolBakingRightsPause>({ type: MEMPOOL_BAKING_RIGHTS_PAUSE });
    }
  }

  changeActiveRound(index: number): void {
    if (this.state.activeRoundIndex !== index) {
      this.store.dispatch<MempoolBakingRightsChangeRound>({ type: MEMPOOL_BAKING_RIGHTS_CHANGE_ROUND, payload: index });
    }
  }
}
