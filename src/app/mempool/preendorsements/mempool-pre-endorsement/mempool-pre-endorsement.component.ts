import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
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
import { animate, style, transition, trigger } from '@angular/animations';
import { debounceTime, distinctUntilChanged, filter, skip } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { selectNetworkLastAppliedBlockLevel } from '@network/network-stats/network-stats.reducer';
import { ADD_INFO, InfoAdd } from '@app/layout/error-popup/error-popup.actions';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SortDirection } from '@shared/types/shared/table-sort.type';
import { MempoolPreEndorsementSort } from '@shared/types/mempool/preendorsement/mempool-preendorsement-sort.type';
import { MempoolPreEndorsement } from '@shared/types/mempool/preendorsement/mempool-preendorsement.type';
import {
  MEMPOOL_PREENDORSEMENT_INIT,
  MEMPOOL_PREENDORSEMENT_LOAD_ROUND,
  MEMPOOL_PREENDORSEMENT_SET_ACTIVE_BAKER,
  MEMPOOL_PREENDORSEMENT_SORT,
  MEMPOOL_PREENDORSEMENT_STOP, MEMPOOL_PREENDORSEMENT_UPDATE_CURRENT_BLOCK,
  MempoolPreEndorsementLoadRound,
  MempoolPreEndorsementSetActiveBaker,
  MempoolPreEndorsementsInit,
  MempoolPreEndorsementSorting,
  MempoolPreEndorsementStop, MempoolPreEndorsementUpdateCurrentBlock
} from '@mempool/preendorsements/mempool-pre-endorsement/mempool-pre-endorsement.actions';
import {
  selectMempoolPreEndorsementActiveBaker,
  selectMempoolPreEndorsements,
  selectMempoolPreEndorsementSorting,
  selectMempoolPreEndorsementTableAnimate
} from '@mempool/preendorsements/mempool-pre-endorsement/mempool-pre-endorsement.reducer';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  MEMPOOL_ENDORSEMENT_UPDATE_CURRENT_BLOCK,
  MempoolEndorsementUpdateCurrentBlock
} from '@mempool/endorsements/mempool-endorsement/mempool-endorsement.actions';


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
  selector: 'app-preendorsement',
  templateUrl: './mempool-pre-endorsement.component.html',
  styleUrls: ['./mempool-pre-endorsement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [translateFromRight, translateFromLeft],
})
export class MempoolPreEndorsementComponent implements OnInit, OnDestroy {

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
  endorsements$: Observable<MempoolPreEndorsement[]>;
  currentSort: MempoolPreEndorsementSort;
  animateRows: 'static' | 'animate' = 'static';
  deltaEnabled = true;
  formGroup: FormGroup;
  activeBaker: string;

  @ViewChild('scrollableContainer') private scrollableContainer: ElementRef<HTMLDivElement>;
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

  readonly trackEndorsements = (index: number, endorsement: MempoolPreEndorsement) => endorsement.status;

  ngOnInit(): void {
    this.listenToNewAppliedBlock();
    this.listenToNewEndorsements();
    this.listenToActiveBakerChange();
    this.initForm();
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.store.dispatch<MempoolPreEndorsementSorting>({
      type: MEMPOOL_PREENDORSEMENT_SORT,
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
      hash: new FormControl(localStorage.getItem('activeBakerPreendorsement'))
    });

    this.formGroup.valueChanges.pipe(
      untilDestroyed(this),
      debounceTime(300)
    ).subscribe(value => {
      this.store.dispatch<MempoolPreEndorsementSetActiveBaker>({
        type: MEMPOOL_PREENDORSEMENT_SET_ACTIVE_BAKER,
        payload: value.hash
      });
    });
  }

  private listenToActiveBakerChange(): void {
    this.store.select(selectMempoolPreEndorsementActiveBaker)
      .pipe(untilDestroyed(this))
      .subscribe(baker => this.activeBaker = baker);
  }

  private listenToNewAppliedBlock(): void {
    this.store.dispatch<MempoolPreEndorsementsInit>({ type: MEMPOOL_PREENDORSEMENT_INIT });
    this.store.select(selectNetworkLastAppliedBlockLevel).pipe(
      untilDestroyed(this),
      filter(Boolean),
      distinctUntilChanged()
    ).subscribe((blockLevel: number) =>
      this.store.dispatch<MempoolPreEndorsementUpdateCurrentBlock>({ type: MEMPOOL_PREENDORSEMENT_UPDATE_CURRENT_BLOCK, payload: { blockLevel } })
    );
  }

  private listenToNewEndorsements(): void {
    this.store.select(selectMempoolPreEndorsementTableAnimate).pipe(
      untilDestroyed(this),
      delay(100),
      skip(2), /* no rows animation on first load */
    ).subscribe(() => {
      this.scrollableContainer.nativeElement.scrollTo({ top: 0 });
      this.animateRows = 'animate';
      this.cdRef.detectChanges();
      setTimeout(() => this.animateRows = 'static', 500);
    });

    this.endorsements$ = this.store.select(selectMempoolPreEndorsements);

    this.store.select(selectMempoolPreEndorsementSorting)
      .pipe(untilDestroyed(this))
      .subscribe(sort => this.currentSort = sort);
  }

  attachOverlay(endorsement: MempoolPreEndorsement, event: MouseEvent): void {
    this.detachTooltip();

    if (!endorsement.operationHashes) {
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
    this.store.dispatch<MempoolPreEndorsementStop>({ type: MEMPOOL_PREENDORSEMENT_STOP });
  }
}
