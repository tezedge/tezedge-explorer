import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { SMART_CONTRACTS_SET_ACTIVE_CONTRACT } from '@smart-contracts/smart-contracts/smart-contracts.actions';
import { ADD_INFO, InfoAdd } from '@shared/components/error-popup/error-popup.actions';
import { Router } from '@angular/router';
import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { selectSmartContracts, selectSmartContractsActiveContract } from '@smart-contracts/smart-contracts/smart-contracts.index';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { NgxObjectDiffService } from 'ngx-object-diff';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

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
  private routedContractHash: string;
  private overlayRef: OverlayRef;
  @ViewChild('tooltipTemplate') private tooltipTemplate: TemplateRef<any>;

  constructor(private store: Store<State>,
              private objectDiff: NgxObjectDiffService,
              private cdRef: ChangeDetectorRef,
              private router: Router,
              private overlay: Overlay,
              private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    this.objectDiff.setOpenChar('');
    this.objectDiff.setCloseChar('');
    this.listenToSmartContractsChange();
    this.listenToRouteChange();
  }

  private listenToSmartContractsChange(): void {
    this.store.select(selectSmartContractsActiveContract)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(contract => {
        this.activeContract = contract;
        if (this.activeContract) {
          this.storageDiff = this.getDifferences(this.activeContract.traceStorage, this.activeContract.blockStorage);
          this.bigMapsDiff = this.getDifferences(this.activeContract.traceBigMaps, this.activeContract.blockBigMaps);
          this.activeTab = 'storage';
        }
        this.cdRef.detectChanges();
      });

    this.store.select(selectSmartContracts)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe((contracts: SmartContract[]) => {
        this.contracts = contracts;
        if (!this.activeContract && this.routedBlockHash) {
          this.selectContractFromRoute();
        }
        this.cdRef.detectChanges();
      });
  }

  private listenToRouteChange(): void {
    this.store.select(getMergedRoute)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe((route: MergedRoute) => {
        this.routedBlockHash = route.params.blockHash;
        if (this.routedContractHash !== route.params.contractHash) {
          this.routedContractHash = route.params.contractHash;
          this.selectContractFromRoute();
        }
      });
  }

  private selectContractFromRoute(): void {
    if (this.contracts.length === 0) {
      return;
    }
    const index = this.contracts.findIndex(op => op.id.toString() === this.routedContractHash);
    if (index !== -1) {
      this.store.dispatch({ type: SMART_CONTRACTS_SET_ACTIVE_CONTRACT, payload: this.contracts[index] });
    }
  }

  selectContract(newContract: SmartContract): void {
    this.routedContractHash = newContract.hash;
    this.router.navigate(['contracts', this.routedBlockHash, newContract.id]);
    this.store.dispatch({ type: SMART_CONTRACTS_SET_ACTIVE_CONTRACT, payload: newContract });
  }

  copyHashToClipboard(hash: string, event: MouseEvent): void {
    event.stopPropagation();
    this.store.dispatch<InfoAdd>({ type: ADD_INFO, payload: 'Copied to clipboard: ' + hash });
  }

  toggleShowDiff(): void {
    this.showDiff = !this.showDiff;
  }

  openDetailsOverlay(contract: SmartContract, event: MouseEvent): void {
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
    const context = this.tooltipTemplate
      .createEmbeddedView({
        traceGas: contract.traceConsumedGas,
        blockStatus: contract.blockExecutionStatus,
        traceStatus: contract.traceExecutionStatus,
        isSameStorage: contract.isSameStorage,
        isSameBigMaps: contract.isSameBigMaps,
      })
      .context;
    const portal = new TemplatePortal(this.tooltipTemplate, this.viewContainerRef, context);
    this.overlayRef.attach(portal);
  }

  detachOverlay(): void {
    this.overlayRef.detach();
  }

  private getDifferences(currentActionState: any, prevActionState: any): string {
    const diff = this.objectDiff.diff(prevActionState || {}, currentActionState || {});
    let innerHTML = this.objectDiff.toJsonDiffView(diff);
    const findAllOccurrences = (str, substr) => {
      str = str.toLowerCase();
      const result = [];
      let idx = str.indexOf(substr);
      while (idx !== -1) {
        result.push(idx);
        idx = str.indexOf(substr, idx + 1);
      }
      return result;
    };
    const delEndingTag = '</del>';
    const insEndingTag = '</ins>';
    innerHTML = innerHTML
      .split('</del><span>,</span>').join(delEndingTag)
      .split('</ins><span>,</span>').join(insEndingTag)
      .split('<span>,</span>').join('')
      .split('<span></span>\n').join('');
    const delStart = '<del class="diff diff-key">';
    const insStart = '<ins class="diff diff-key">';
    const insDiffStart = '<ins class="diff">';
    const insEnd = '</ins>';
    const spanInside = '<span>: </span>';
    findAllOccurrences(innerHTML, delStart).reverse().forEach(index => {
      const delContentStartIdx = index + delStart.length;
      const spanDelEndLimit = delContentStartIdx + innerHTML.substr(delContentStartIdx).indexOf(spanInside) + spanInside.length;
      const delContentEndIdx = delContentStartIdx + innerHTML.substr(delContentStartIdx).indexOf(delEndingTag);
      let oldValue = innerHTML.substring(spanDelEndLimit, delContentEndIdx);
      oldValue = SmartContractsTableComponent.removeQuotesFromBigNumber(oldValue);
      const oldValueTag = '<div class="old-value">' + oldValue + '</div>';
      innerHTML = innerHTML.substring(0, spanDelEndLimit) + oldValueTag + innerHTML.substring(delContentEndIdx);
    });
    findAllOccurrences(innerHTML, delStart).reverse().forEach(index => {
      const delContentStartIdx = index + delStart.length;
      const delContentEndIdx = delContentStartIdx + innerHTML.substr(delContentStartIdx).indexOf(delEndingTag);
      const nextInsTagStart = delContentEndIdx + innerHTML.substr(delContentEndIdx).indexOf(delEndingTag) + delEndingTag.length + 1;
      const nextInsTagEnd = delContentEndIdx + innerHTML.substr(delContentEndIdx).indexOf(insEndingTag) + insEndingTag.length;
      const nextInsTag = innerHTML.substring(nextInsTagStart, nextInsTagEnd);
      innerHTML = innerHTML.substring(0, delContentEndIdx) + nextInsTag + innerHTML.substring(delContentEndIdx);
      innerHTML = innerHTML.substring(0, nextInsTagStart + nextInsTag.length - 1) + innerHTML.substring(nextInsTagEnd + nextInsTag.length);
    });
    findAllOccurrences(innerHTML, insStart).reverse().forEach(index => {
      const insContentStartIdx = index + insStart.length;
      const spanInsEndLimit = innerHTML.substr(insContentStartIdx).indexOf(spanInside) + spanInside.length;
      innerHTML = innerHTML.substring(0, insContentStartIdx) + innerHTML.substring(insContentStartIdx + spanInsEndLimit);
    });
    // search which has del right near div.diff-level and wrap all dels inside a div
    // this covers case when multiple entries has been replaced by a single new one
    const diffLevel = '<div class="diff-level"><del';
    findAllOccurrences(innerHTML, diffLevel).reverse().forEach(index => {
      const divContentStart = index + diffLevel.length - 4;
      const indexOfInsDiffStart = innerHTML.substr(divContentStart).indexOf(insDiffStart);
      const indexOfIns = innerHTML.substr(divContentStart).indexOf('<ins');
      if (indexOfInsDiffStart !== -1 && indexOfInsDiffStart === indexOfIns) {
        const insTagStart = divContentStart + indexOfInsDiffStart;
        innerHTML = innerHTML.substring(0, divContentStart)
          + '<div class="group-del">'
          + innerHTML.substring(divContentStart, insTagStart)
          + '</div>'
          + innerHTML.substring(insTagStart);
      }
    });
    findAllOccurrences(innerHTML, insStart).reverse().forEach(index => {
      const insContentStartIdx = index + insStart.length;
      const insContentEndIdx = insContentStartIdx + innerHTML.substr(insContentStartIdx).indexOf(insEnd);
      let insContent = innerHTML.substring(insContentStartIdx, insContentEndIdx);
      insContent = SmartContractsTableComponent.removeQuotesFromBigNumber(insContent);
      innerHTML = innerHTML.substring(0, insContentStartIdx) + insContent + innerHTML.substring(insContentEndIdx);
    });
    return innerHTML;
  }

  private static removeQuotesFromBigNumber(text: string): string {
    // for big numbers wrapped in strings, remove quotes to be shown as numbers; 17 characters is min + 2 quotes = 19 min
    if (/"(\d+)"/.test(text) && text.length >= 19) {
      text = text.slice(1, text.length - 1);
    }
    return text;
  }
}
