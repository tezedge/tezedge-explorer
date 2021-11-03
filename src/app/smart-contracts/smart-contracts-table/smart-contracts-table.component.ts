import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { Observable, tap } from 'rxjs';
import { SMART_CONTRACTS_LOAD, SMART_CONTRACTS_SET_ACTIVE_CONTRACT } from '@smart-contracts/smart-contracts/smart-contracts.actions';
import { ADD_INFO, InfoAdd } from '@shared/components/error-popup/error-popup.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';
import { selectSmartContracts, selectSmartContractsActiveContract } from '@smart-contracts/smart-contracts/smart-contracts.reducer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-smart-contracts-table',
  templateUrl: './smart-contracts-table.component.html',
  styleUrls: ['./smart-contracts-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartContractsTableComponent implements OnInit {

  contracts$: Observable<SmartContract[]>;
  activeContract: SmartContract;
  private contracts: SmartContract[];

  constructor(private store: Store<State>,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.listenToSmartContractsChange();
    this.store.dispatch({ type: SMART_CONTRACTS_LOAD });
  }

  selectContract(newContract: SmartContract): void {
    this.router.navigate([], {
      queryParams: { hash: newContract.hash },
      queryParamsHandling: 'merge',
    });
    this.store.dispatch({ type: SMART_CONTRACTS_SET_ACTIVE_CONTRACT, payload: newContract });
  }

  private listenToSmartContractsChange(): void {
    this.store.select(selectSmartContractsActiveContract).pipe(untilDestroyed(this)).subscribe(contract => this.activeContract = contract);
    this.contracts$ = this.store.select(selectSmartContracts).pipe(
      tap(contracts => {
        this.contracts = contracts;
        this.selectContractFromRoute();
      })
    );
  }

  private selectContractFromRoute(): void | never {
    if (!this.contracts) {
      return;
    }
    const urlHash = this.route.snapshot.queryParams['hash'];
    const index = this.contracts.findIndex(op => op.hash === urlHash);
    if (index !== -1) {
      this.selectContract(this.contracts[index]);
    }
  }

  copyHashToClipboard(hash: string, event: MouseEvent) {
    event.stopPropagation();
    this.store.dispatch<InfoAdd>({ type: ADD_INFO, payload: 'Copied to clipboard: ' + hash });
  }
}
