import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { Observable } from 'rxjs';
import { MempoolEndorsement } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement.type';
import {
  MEMPOOL_ENDORSEMENT_LOAD,
  MEMPOOL_ENDORSEMENT_SORT,
  MEMPOOL_ENDORSEMENT_STOP,
  MEMPOOL_ENDORSEMENTS_INIT,
  MempoolEndorsementLoad,
  MempoolEndorsementsInit,
  MempoolEndorsementSorting,
  MempoolEndorsementStop
} from '@mempool/mempool-endorsement/mempool-endorsement.action';
import { animate, style, transition, trigger } from '@angular/animations';
import { distinctUntilChanged, filter, skip } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MempoolEndorsementSort } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-sort.type';
import { selectNetworkCurrentBlock } from '@network/network-stats/network-stats.reducer';
import {
  selectMempoolEndorsements,
  selectMempoolEndorsementSorting,
  selectMempoolEndorsementTableAnimate
} from '@mempool/mempool-endorsement/mempool-endorsement.reducer';


// const statusUpdate = trigger('statusUpdate', [
//   transition('void => *', [style({ opacity: 1, transform: 'translateX(0)' }), animate(0)]),
//   transition('* => *', [
//     style({ opacity: 0.7, transform: 'translateX(-10px)' }),
//     animate('.35s ease', style({ opacity: 1, transform: 'translateX(0)' }))
//   ])
// ]);
// const onlyStatusUpdate = trigger('onlyStatusUpdate', [
//   transition('void => *', [style({ opacity: 1, transform: 'translateX(0)' }), animate(0)]),
//   transition('* => *', [
//     style({ opacity: 0.7, transform: 'translateX(-10px)' }),
//     animate('.35s ease', style({ opacity: 1, transform: 'translateX(0)' }))
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
  animations: [translateFromRight, translateFromLeft],
})
export class MempoolEndorsementComponent implements OnInit, OnDestroy {

  endorsements$: Observable<MempoolEndorsement[]>;
  animateRows = 0;
  currentSort: MempoolEndorsementSort;

  @ViewChild('scrollableContainer') private scrollableContainer: ElementRef<HTMLDivElement>;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  readonly trackEndorsements = endorsement => endorsement.status;
  readonly tableHeads = [
    { name: 'slots', sort: 'slotsLength' },
    { name: 'baker', sort: 'bakerName' },
    { name: 'status' },
    { name: 'delta' },
    { name: 'receive', sort: 'receiveTime' },
    { name: 'decode', sort: 'decodeTime' },
    { name: 'precheck', sort: 'precheckTime' },
    { name: 'apply', sort: 'applyTime' },
    { name: 'broadcast', sort: 'broadcastTime' },
  ];

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
    this.store.select(selectNetworkCurrentBlock).pipe(
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
      this.scrollableContainer.nativeElement.scrollTo({ top: 0 });
      this.animateRows++;
      this.cdRef.detectChanges();
    });

    this.endorsements$ = this.store.select(selectMempoolEndorsements);

    this.store.select(selectMempoolEndorsementSorting)
      .pipe(untilDestroyed(this))
      .subscribe(sort => this.currentSort = sort);
  }

  ngOnDestroy(): void {
    this.store.dispatch<MempoolEndorsementStop>({ type: MEMPOOL_ENDORSEMENT_STOP });
  }

}
