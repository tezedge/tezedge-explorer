import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { selectSmartContractsResult, selectSmartContractsTrace } from '@smart-contracts/smart-contracts/smart-contracts.reducer';
import { SmartContractResult } from '@shared/types/smart-contracts/smart-contract-result.type';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-smart-contracts-result',
  templateUrl: './smart-contracts-result.component.html',
  styleUrls: ['./smart-contracts-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartContractsResultComponent implements OnInit {

  result$: Observable<SmartContractResult>;
  trace$: Observable<any>;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.listenToResultChanges();
  }

  private listenToResultChanges(): void {
    this.result$ = this.store.select(selectSmartContractsResult);
    this.trace$ = this.store.select(selectSmartContractsTrace).pipe(
      map(trace => trace.history[0].receipt)
    );
  }

}
