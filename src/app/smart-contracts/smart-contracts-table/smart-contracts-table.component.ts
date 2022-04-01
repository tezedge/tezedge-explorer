import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.index';
import { SMART_CONTRACTS_SET_ACTIVE_CONTRACT, SmartContractsSetActiveContractAction } from '@smart-contracts/smart-contracts/smart-contracts.actions';
import { ADD_INFO, InfoAdd } from '@app/layout/error-popup/error-popup.actions';
import { Router } from '@angular/router';
import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { selectSmartContracts, selectSmartContractsActiveContract } from '@smart-contracts/smart-contracts/smart-contracts.index';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SmartContractsTableTooltipComponent } from '@smart-contracts/smart-contracts-table-tooltip/smart-contracts-table-tooltip.component';
import { TezedgeDiffToolFactory } from '@shared/factories/tezedge-diff-tool.factory';

@UntilDestroy()
@Component({
  selector: 'app-smart-contracts-table',
  templateUrl: './smart-contracts-table.component.html',
  styleUrls: ['./smart-contracts-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartContractsTableComponent implements OnInit {

  activeContract: SmartContract;
  contracts: SmartContract[] = [];
  storageDiff: string;
  bigMapsDiff: string;
  activeTab: 'storage' | 'big-maps';
  showDiff: boolean;

  private routedBlockHash: number;
  private routedContractId: string;
  private overlayRef: OverlayRef;
  private componentRef: ComponentRef<SmartContractsTableTooltipComponent>;
  private activeTooltipContractId: number;

  constructor(private store: Store<State>,
              private tezedgeDiffTool: TezedgeDiffToolFactory,
              private cdRef: ChangeDetectorRef,
              private router: Router,
              private overlay: Overlay) { }

  ngOnInit(): void {
    this.listenToSmartContractsChange();
    this.listenToRouteChange();
  }

  private listenToSmartContractsChange(): void {
    this.store.select(selectSmartContractsActiveContract)
      .pipe(untilDestroyed(this))
      .subscribe(contract => {
        this.activeContract = contract;
        if (this.activeContract) {
          this.storageDiff = this.tezedgeDiffTool.getDifferences(this.activeContract.traceStorage, this.activeContract.blockStorage);
          this.bigMapsDiff = this.tezedgeDiffTool.getDifferences(this.activeContract.traceBigMaps, this.activeContract.blockBigMaps);
          this.activeTab = 'storage';
        }
        this.cdRef.detectChanges();
      });

    this.store.select(selectSmartContracts)
      .pipe(untilDestroyed(this))
      .subscribe((contracts: SmartContract[]) => {
        if (
          this.overlayRef?.hasAttached()
          && this.contracts[this.activeTooltipContractId].traceExecutionStatus !== contracts[this.activeTooltipContractId].traceExecutionStatus
        ) {
          this.attachInputsToTooltipComponent(contracts[this.activeTooltipContractId]);
        }

        this.contracts = contracts;
        if (!this.activeContract && this.routedContractId && this.contracts[this.routedContractId].balance !== undefined) {
          this.selectContractFromRoute();
        }
        this.cdRef.detectChanges();
      });
  }

  private listenToRouteChange(): void {
    this.store.select(getMergedRoute)
      .pipe(untilDestroyed(this))
      .subscribe((route: MergedRoute) => {
        this.routedBlockHash = route.params.blockHash;
        if (this.routedContractId !== route.params.contractHash) {
          this.routedContractId = route.params.contractHash;
          this.selectContractFromRoute();
        } else if (this.routedBlockHash && !route.params.contractHash) {
          this.routedContractId = route.params.contractHash || '0';
          this.router.navigate(['contracts', this.routedBlockHash, this.routedContractId]);
          this.selectContractFromRoute();
        }
      });
  }

  private selectContractFromRoute(): void {
    if (this.contracts.length === 0) {
      return;
    }
    const index = this.contracts.findIndex(op => op.id.toString() === this.routedContractId);
    if (index !== -1) {
      this.store.dispatch<SmartContractsSetActiveContractAction>({ type: SMART_CONTRACTS_SET_ACTIVE_CONTRACT, payload: this.contracts[index] });
    }
  }

  selectContract(newContract: SmartContract): void {
    this.routedContractId = newContract.hash;
    this.router.navigate(['contracts', this.routedBlockHash, newContract.id]);
    this.store.dispatch<SmartContractsSetActiveContractAction>({ type: SMART_CONTRACTS_SET_ACTIVE_CONTRACT, payload: newContract });
  }

  copyHashToClipboard(hash: string, event: MouseEvent): void {
    event.stopPropagation();
    this.store.dispatch<InfoAdd>({ type: ADD_INFO, payload: 'Copied to clipboard: ' + hash });
  }

  toggleShowDiff(): void {
    this.showDiff = !this.showDiff;
  }

  openDetailsOverlay(contract: SmartContract, event: MouseEvent): void {
    this.activeTooltipContractId = contract.id;
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
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

    const portal = new ComponentPortal(SmartContractsTableTooltipComponent);
    this.componentRef = this.overlayRef.attach<SmartContractsTableTooltipComponent>(portal);
    this.attachInputsToTooltipComponent(contract);
  }

  private attachInputsToTooltipComponent(contract: SmartContract): void {
    this.componentRef.instance.traceGas = contract.traceConsumedGas;
    this.componentRef.instance.blockStatus = contract.blockExecutionStatus;
    this.componentRef.instance.traceStatus = contract.traceExecutionStatus;
    this.componentRef.instance.isSameStorage = contract.isSameStorage;
    this.componentRef.instance.isSameBigMaps = contract.isSameBigMaps;
    this.componentRef.instance.cdRef.detectChanges();
  }

  detachOverlay(): void {
    this.overlayRef.detach();
  }
}
