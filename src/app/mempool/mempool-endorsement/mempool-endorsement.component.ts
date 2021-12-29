import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { delay, Observable } from 'rxjs';
import { MempoolEndorsement } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement.type';
import {
  MEMPOOL_ENDORSEMENT_LOAD,
  MEMPOOL_ENDORSEMENT_SET_ACTIVE_BAKER,
  MEMPOOL_ENDORSEMENT_SORT,
  MEMPOOL_ENDORSEMENT_STOP,
  MEMPOOL_ENDORSEMENTS_INIT,
  MempoolEndorsementLoad,
  MempoolEndorsementSetActiveBaker,
  MempoolEndorsementsInit,
  MempoolEndorsementSorting,
  MempoolEndorsementStop
} from '@mempool/mempool-endorsement/mempool-endorsement.actions';
import { animate, style, transition, trigger } from '@angular/animations';
import { debounceTime, distinctUntilChanged, filter, skip } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MempoolEndorsementSort } from '@shared/types/mempool/mempool-endorsement/mempool-endorsement-sort.type';
import { selectNetworkCurrentBlock } from '@network/network-stats/network-stats.reducer';
import {
  selectMempoolEndorsementActiveBaker,
  selectMempoolEndorsements,
  selectMempoolEndorsementSorting,
  selectMempoolEndorsementTableAnimate
} from '@mempool/mempool-endorsement/mempool-endorsement.reducer';
import { ADD_INFO, InfoAdd } from '@shared/error-popup/error-popup.actions';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


const translateFromRight = trigger('translateFromRight', [
  transition(':increment', [
    style({ opacity: 0, transform: 'translateX(50px)' }),
    animate('.35s ease', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);

const translateFromLeft = trigger('translateFromLeft', [
  transition(':increment', [
    style({ opacity: 0, transform: 'translateX(-50px)' }),
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

  readonly trackEndorsements = (index: number, endorsement: MempoolEndorsement) => endorsement.bakerName;
  readonly tableHeads = [
    { name: 'slots', sort: 'slotsLength' },
    { name: 'baker', sort: 'bakerName' },
    { name: 'status' },
    { name: 'delta' },
    { name: 'receive hash', sort: 'receiveHashTime' },
    { name: 'receive contents', sort: 'receiveContentsTime', deltaAvailable: true },
    { name: 'decode', sort: 'decodeTime', deltaAvailable: true },
    { name: 'precheck', sort: 'precheckTime', deltaAvailable: true },
    { name: 'apply', sort: 'applyTime', deltaAvailable: true },
    { name: 'broadcast', sort: 'broadcastTime', deltaAvailable: true },
  ];

  endorsements$: Observable<MempoolEndorsement[]>;
  currentSort: MempoolEndorsementSort;
  animateRows = 10;
  deltaEnabled = true;
  formGroup: FormGroup;
  activeBaker: string;

  @ViewChild('scrollableContainer') private scrollableContainer: ElementRef<HTMLDivElement>;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.listenToNewAppliedBlock();
    this.listenToNewEndorsements();
    this.listenToActiveBakerChange();
    this.initForm();
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      hash: new FormControl(localStorage.getItem('activeBaker'))
    });

    this.formGroup.valueChanges.pipe(
      untilDestroyed(this),
      debounceTime(300)
    ).subscribe(value => {
      this.store.dispatch<MempoolEndorsementSetActiveBaker>({
        type: MEMPOOL_ENDORSEMENT_SET_ACTIVE_BAKER,
        payload: value.hash
      });
    });
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

  private listenToActiveBakerChange(): void {
    this.store.select(selectMempoolEndorsementActiveBaker)
      .pipe(untilDestroyed(this))
      .subscribe(baker => this.activeBaker = baker);
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
      delay(100),
      skip(2), /* no rows animation on first load */
    ).subscribe(() => {
      this.scrollableContainer.nativeElement.scrollTo({ top: 0 });
      this.animateRows = this.animateRows + 1;
      this.cdRef.detectChanges();
    });

    this.endorsements$ = this.store.select(selectMempoolEndorsements);

    this.store.select(selectMempoolEndorsementSorting)
      .pipe(untilDestroyed(this))
      .subscribe(sort => this.currentSort = sort);
  }

  copyHashToClipboard(hash: string): void {
    this.store.dispatch<InfoAdd>({ type: ADD_INFO, payload: 'Copied to clipboard: ' + hash });
  }

  onDeltaClick(event: MatCheckboxChange): void {
    this.deltaEnabled = event.checked;
    this.cdRef.detectChanges();

    const tableHead = this.tableHeads.find(th => th.deltaAvailable && this.currentSort.sortBy.includes(th.sort));
    if (tableHead) {
      this.sortTable(this.deltaEnabled ? this.currentSort.sortBy + 'Delta' : tableHead.sort);
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch<MempoolEndorsementStop>({ type: MEMPOOL_ENDORSEMENT_STOP });
  }
}
