import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  SMART_CONTRACTS_LOAD,
  SMART_CONTRACTS_RESET_BLOCKS,
  SmartContractsLoadAction,
  SmartContractsResetBlocksAction
} from '@smart-contracts/smart-contracts/smart-contracts.actions';
import { Router } from '@angular/router';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { selectActiveNodeHeader } from '@settings/settings-node.reducer';
import { SettingsNodeEntityHeader } from '@shared/types/settings-node/settings-node-entity-header.type';
import { selectSmartContractsBlockHashContext } from '@smart-contracts/smart-contracts/smart-contracts.index';
import { selectNetworkCurrentBlockHash } from '@network/network-stats/network-stats.reducer';

@UntilDestroy()
@Component({
  selector: 'app-smart-contracts-filters',
  templateUrl: './smart-contracts-filters.component.html',
  styleUrls: ['./smart-contracts-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartContractsFiltersComponent implements OnInit {

  formGroup: FormGroup;
  blockHashContext: { hashes: string[], activeIndex: number };

  private routedBlockHash: string;
  private routedContractHash: string;
  private latestAppliedBlockHash: string;

  constructor(private store: Store<State>,
              private router: Router,
              private cdRef: ChangeDetectorRef,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.listenToRouteChange();
    this.listenToActiveNodeHeader();
    this.listenToBlockHashContext();
    this.listenToLatestAppliedBlock();
  }

  private listenToActiveNodeHeader(): void {
    this.store.select(selectActiveNodeHeader)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((header: SettingsNodeEntityHeader) => {
        if (!this.routedBlockHash) {
          this.routedBlockHash = header.hash;
          this.formGroup.get('blockHash').setValue(this.routedBlockHash);
          this.store.dispatch<SmartContractsResetBlocksAction>({ type: SMART_CONTRACTS_RESET_BLOCKS, payload: { blocks: [header.predecessor, header.hash], activeIndex: 1 } });
          this.router.navigate(['contracts', header.hash]);
        }
      });
  }

  private listenToRouteChange(): void {
    this.store.select(getMergedRoute)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((route: MergedRoute) => {
        this.routedContractHash = route.params.contractHash;
        if (this.routedBlockHash !== route.params.blockHash) {
          this.routedBlockHash = route.params.blockHash;
          this.formGroup.get('blockHash').setValue(this.routedBlockHash);
          this.store.dispatch<SmartContractsResetBlocksAction>({ type: SMART_CONTRACTS_RESET_BLOCKS, payload: { blocks: [this.routedBlockHash], activeIndex: 0 } });
        }
      });
  }

  private listenToBlockHashContext(): void {
    this.store.select(selectSmartContractsBlockHashContext)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(blockHashContext => {
        this.blockHashContext = blockHashContext;
        this.cdRef.detectChanges();
      });
  }

  private listenToLatestAppliedBlock(): void {
    this.store.select(selectNetworkCurrentBlockHash)
      .pipe(untilDestroyed(this))
      .subscribe(hash => this.latestAppliedBlockHash = hash);
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      blockHash: new FormControl(),
    });
  }

  searchSmartContracts(): void {
    const value = this.formGroup.get('blockHash').value;
    if (this.routedBlockHash !== value) {
      this.routedBlockHash = value;
      this.store.dispatch<SmartContractsResetBlocksAction>({ type: SMART_CONTRACTS_RESET_BLOCKS, payload: { blocks: [this.routedBlockHash], activeIndex: 0 } });
      this.router.navigate(['contracts', this.routedBlockHash]);
    }
  }

  loadPreviousBlock(): void {
    this.routedBlockHash = this.blockHashContext.hashes[this.blockHashContext.activeIndex - 1];
    this.formGroup.get('blockHash').setValue(this.routedBlockHash);
    this.store.dispatch<SmartContractsLoadAction>({ type: SMART_CONTRACTS_LOAD, payload: { blockHash: this.routedBlockHash } });
    this.router.navigate(['contracts', this.routedBlockHash]);
  }

  loadNextBlock(): void {
    this.routedBlockHash = this.blockHashContext.hashes[this.blockHashContext.activeIndex + 1];
    this.formGroup.get('blockHash').setValue(this.routedBlockHash);
    this.store.dispatch<SmartContractsLoadAction>({ type: SMART_CONTRACTS_LOAD, payload: { blockHash: this.routedBlockHash } });
    this.router.navigate(['contracts', this.routedBlockHash]);
  }

  loadLatestAppliedBlock(): void {
    if (this.routedBlockHash !== this.latestAppliedBlockHash) {
      this.routedBlockHash = this.latestAppliedBlockHash;
      this.formGroup.get('blockHash').setValue(this.routedBlockHash);
      this.store.dispatch<SmartContractsResetBlocksAction>({ type: SMART_CONTRACTS_RESET_BLOCKS, payload: { blocks: [this.routedBlockHash], activeIndex: 0 } });
      this.router.navigate(['contracts', this.routedBlockHash]);
    }
  }
}
