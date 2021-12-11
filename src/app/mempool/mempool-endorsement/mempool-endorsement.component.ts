import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { Observable } from 'rxjs';
import { MempoolEndorsement } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement.type';
import {
  MEMPOOL_ENDORSEMENT_LOAD,
  MEMPOOL_ENDORSEMENT_SORT,
  MEMPOOL_ENDORSEMENT_STOP,
  MEMPOOL_ENDORSEMENT_UPDATE_STATUSES,
  MEMPOOL_ENDORSEMENTS_INIT,
  MempoolEndorsementLoad,
  MempoolEndorsementsInit,
  MempoolEndorsementSorting,
  MempoolEndorsementStop,
  MempoolEndorsementUpdateStatuses
} from '@mempool/mempool-endorsement/mempool-endorsement.action';
import { animate, style, transition, trigger } from '@angular/animations';
import { distinctUntilChanged, filter, skip, tap } from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MempoolEndorsementSort } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-sort.type';
import { selectNetworkDownloadedBlocks } from '@network/network-stats/network-stats.reducer';
import {
  selectMempoolEndorsements,
  selectMempoolEndorsementSorting,
  selectMempoolEndorsementTableAnimate
} from '@mempool/mempool-endorsement/mempool-endorsement.reducer';


const statusUpdate = trigger('statusUpdate', [
  transition('void => *', [style({ opacity: 1, transform: 'translateX(0)' }), animate(0)]),
  transition('* => *', [
    style({ opacity: 0.7, transform: 'translateX(-10px)' }),
    animate('.35s ease', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);
// const fadeInOut2 = trigger('fadeInOut2', [
//   // transition('void => *', [style({ opacity: '1', background: 'blue' }), animate(fadeInOutTimeout)]),
//   transition('* => *', [
//     style({ opacity: '0.3', border: '1px solid white', transitionDelay: '1.5s' }),
//     animate(250, style({ opacity: '1', border: '1px solid transparent', transitionDelay: '1.5s' })),
//   ])
// ]);
const translateFromRight = trigger('translateFromRight', [
  transition(':increment', [
    style({ height: '*', opacity: 0, transform: 'translateX(50px)' }),
    animate('.35s ease', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);

const translateFromLeft = trigger('translateFromLeft', [
  transition(':increment', [
    style({ height: '*', opacity: 0, transform: 'translateX(-50px)' }),
    animate('.35s ease', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);

@UntilDestroy()
@Component({
  selector: 'app-mempool-endorsement',
  templateUrl: './mempool-endorsement.component.html',
  styleUrls: ['./mempool-endorsement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [translateFromRight, translateFromLeft, statusUpdate],
})
export class MempoolEndorsementComponent implements OnInit, OnDestroy {

  endorsements$: Observable<MempoolEndorsement[]>;
  activeEndorsement: MempoolEndorsement;
  animateRows = 0;
  currentSort: MempoolEndorsementSort;

  @ViewChild(CdkVirtualScrollViewport) private virtualScrollViewport: CdkVirtualScrollViewport;

  private loaded = false;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  readonly trackEndorsements = endorsement => endorsement.status;

  ngOnInit(): void {
    this.listenToNewAppliedBlock();
    this.listenToNewEndorsements();
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === 'ascending' ? 'descending' : 'ascending';
    this.store.dispatch<MempoolEndorsementSorting>({
      type: MEMPOOL_ENDORSEMENT_SORT,
      payload: {
        sortBy,
        sortDirection
      }
    });
  }

  private listenToNewAppliedBlock(): void {
    this.store.dispatch<MempoolEndorsementsInit>({ type: MEMPOOL_ENDORSEMENTS_INIT });
    this.store.select(selectNetworkDownloadedBlocks).pipe(
      untilDestroyed(this),
      filter(Boolean),
      distinctUntilChanged()
    ).subscribe((currentBlock: number) =>
      this.store.dispatch<MempoolEndorsementLoad>({ type: MEMPOOL_ENDORSEMENT_LOAD, payload: { currentBlock } })
    );
  }

  private listenToNewEndorsements(): void {
    this.store.select(selectMempoolEndorsementTableAnimate).pipe(
      untilDestroyed(this),
      skip(2), /* no animation when first load the page */
    ).subscribe(() => {
      this.virtualScrollViewport.scrollToIndex(0);
      this.animateRows++;
      this.cdRef.detectChanges();
    });

    this.endorsements$ = this.store.select(selectMempoolEndorsements).pipe(
      filter(list => list.length > 0),
      tap(() => {
        if (!this.loaded) {
          this.loaded = true;
        }
        // TODO: remove
        // setTimeout(() => {
        //   this.store.dispatch<MempoolEndorsementUpdateStatuses>({ type: MEMPOOL_ENDORSEMENT_UPDATE_STATUSES });
        // }, 1000);
      }));

    this.store.select(selectMempoolEndorsementSorting)
      .pipe(untilDestroyed(this))
      .subscribe(sort => this.currentSort = sort);
  }

  ngOnDestroy(): void {
    this.store.dispatch<MempoolEndorsementStop>({ type: MEMPOOL_ENDORSEMENT_STOP });
  }

}
