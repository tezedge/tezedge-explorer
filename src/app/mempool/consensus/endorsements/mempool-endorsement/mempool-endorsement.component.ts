import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { delay, Observable } from 'rxjs';
import { MempoolEndorsement } from '@shared/types/mempool/endorsement/mempool-endorsement.type';
import {
  MEMPOOL_ENDORSEMENT_INIT,
  MEMPOOL_ENDORSEMENT_LOAD,
  MEMPOOL_ENDORSEMENT_SET_ACTIVE_BAKER,
  MEMPOOL_ENDORSEMENT_SET_ROUND,
  MEMPOOL_ENDORSEMENT_SORT,
  MEMPOOL_ENDORSEMENT_STOP,
  MempoolEndorsementLoad,
  MempoolEndorsementSetActiveBaker,
  MempoolEndorsementSetRound,
  MempoolEndorsementsInit,
  MempoolEndorsementSorting,
  MempoolEndorsementStop
} from '@mempool/consensus/endorsements/mempool-endorsement/mempool-endorsement.actions';
import { animate, style, transition, trigger } from '@angular/animations';
import { debounceTime, distinctUntilChanged, filter, skip } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MempoolEndorsementSort } from '@shared/types/mempool/endorsement/mempool-endorsement-sort.type';
import {
  selectMempoolEndorsementActiveBaker,
  selectMempoolEndorsements,
  selectMempoolEndorsementSorting,
  selectMempoolEndorsementTableAnimate
} from '@mempool/consensus/endorsements/mempool-endorsement/mempool-endorsement.index';
import { ADD_INFO, InfoAdd } from '@app/layout/error-popup/error-popup.actions';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SortDirection } from '@shared/types/shared/table-sort.type';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Router } from '@angular/router';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { selectMempoolConsensusActiveRound } from '@mempool/consensus/mempool-consensus.index';
import { MempoolConsensusRound } from '@shared/types/mempool/consensus/mempool-consensus-round.type';


const translateFromRight = trigger('translateFromRight', [
  transition('static => animate', [
    style({ opacity: 0, transform: 'translateX(50px)' }),
    animate('.35s ease', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);

const translateFromLeft = trigger('translateFromLeft', [
  transition('static => animate', [
    style({ opacity: 0, transform: 'translateX(-50px)' }),
    animate('.35s ease', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);

@UntilDestroy()
@Component({
  selector: 'app-endorsement',
  templateUrl: './mempool-endorsement.component.html',
  styleUrls: ['./mempool-endorsement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [translateFromRight, translateFromLeft],
})
export class MempoolEndorsementComponent implements OnInit, OnDestroy {

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
    { name: 'level' },
    { name: 'round' },
    { name: 'branch' },
  ];
  readonly FIFTY_MS = 50000000;
  readonly TWENTY_MS = 20000000;

  endorsements$: Observable<MempoolEndorsement[]>;
  currentSort: MempoolEndorsementSort;
  animateRows: 'static' | 'animate' = 'static';
  deltaEnabled = true;
  formGroup: FormGroup;
  activeBaker: string;

  @ViewChild(CdkVirtualScrollViewport) private scrollableContainer: CdkVirtualScrollViewport;
  @ViewChild('tooltipTemplate') private tooltipTemplate: TemplateRef<any>;

  private overlayRef: OverlayRef;

  @HostListener('document:click')
  onDocumentClick(): void {
    this.detachTooltip();
  }

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private formBuilder: FormBuilder,
              private router: Router,
              private overlay: Overlay,
              private viewContainerRef: ViewContainerRef) { }

  readonly trackEndorsements = (index: number, endorsement: MempoolEndorsement) => endorsement.status;

  ngOnInit(): void {
    this.store.dispatch<MempoolEndorsementsInit>({ type: MEMPOOL_ENDORSEMENT_INIT, payload: this.router.url.includes('pre-') ? 'pre-' : '' });
    this.listenToBlockChange();
    this.listenToNewEndorsements();
    this.listenToActiveBakerChange();
    this.initForm();
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.store.dispatch<MempoolEndorsementSorting>({
      type: MEMPOOL_ENDORSEMENT_SORT,
      payload: {
        sortBy,
        sortDirection
      }
    });
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

  private listenToActiveBakerChange(): void {
    this.store.select(selectMempoolEndorsementActiveBaker)
      .pipe(untilDestroyed(this))
      .subscribe(baker => this.activeBaker = baker);
  }

  private listenToBlockChange(): void {
    this.store.select(selectMempoolConsensusActiveRound).pipe(
      untilDestroyed(this),
      filter(Boolean),
      distinctUntilChanged()
    ).subscribe((round: MempoolConsensusRound) => {
      this.store.dispatch<MempoolEndorsementLoad>({ type: MEMPOOL_ENDORSEMENT_LOAD, payload: { blockLevel: round.blockLevel } });
      this.store.dispatch<MempoolEndorsementSetRound>({ type: MEMPOOL_ENDORSEMENT_SET_ROUND, payload: { round } });
    });
  }

  private listenToNewEndorsements(): void {
    this.store.select(selectMempoolEndorsementTableAnimate).pipe(
      untilDestroyed(this),
      delay(100),
      skip(2), /* no rows animation on first load */
    ).subscribe(() => {
      this.scrollableContainer.scrollTo({ top: 0 });
      this.animateRows = 'animate';
      this.cdRef.detectChanges();
      setTimeout(() => this.animateRows = 'static', 500);
    });

    this.endorsements$ = this.store.select(selectMempoolEndorsements);

    this.store.select(selectMempoolEndorsementSorting)
      .pipe(untilDestroyed(this))
      .subscribe(sort => this.currentSort = sort);
  }

  attachOverlay(endorsement: MempoolEndorsement, event: MouseEvent): void {
    this.detachTooltip();

    if (endorsement.operationHashes.length === 0) {
      return;
    }

    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(event.target as HTMLElement)
        .withPositions([{
          originX: 'center',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: 0,
          offsetY: 10
        }])
    });

    event.stopPropagation();
    const context = this.tooltipTemplate
      .createEmbeddedView({
        operations: endorsement.operationHashes.join(',')
      })
      .context;
    const portal = new TemplatePortal(this.tooltipTemplate, this.viewContainerRef, context);
    this.overlayRef.attach(portal);
  }

  detachTooltip(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  seeInStatistics(operations: string): void {
    this.router.navigate(['mempool', 'statistics', operations.split(',')[0]], {
      queryParams: { operations }
    });
  }

  ngOnDestroy(): void {
    this.detachTooltip();
    this.store.dispatch<MempoolEndorsementStop>({ type: MEMPOOL_ENDORSEMENT_STOP });
  }
}
