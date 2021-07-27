import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { NetworkAction } from '@shared/types/network/network-action.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-mempool-action',
  templateUrl: './mempool-action.component.html',
  styleUrls: ['./mempool-action.component.scss'],
})
export class MempoolActionComponent implements OnInit, OnDestroy {

  public mempoolAction;
  public mempoolActionList = [];
  public displayedColumns: string[] = ['hash', 'type'];
  public mempoolSelectedItem: any;
  public mempoolClickedItem: any;

  public networkAction;
  public networkActionList = [];

  public networkAction$;
  public networkDataSource;
  public networkActionlastCursorId = 0;

  constructor(
    public store: Store<State>,
  ) { }

  ngOnInit(): void {

    // wait for data changes from redux
    this.store.select('mempoolAction')
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        this.mempoolAction = data;
        this.mempoolActionList = data.ids.map(id => ({ id, ...data.entities[id] }));

        if (this.mempoolActionList.length) {
          this.mempoolSelectedItem = this.mempoolActionList[this.mempoolActionList.length - 1];

          if (!this.mempoolClickedItem || !data.entities[this.mempoolClickedItem.id]) {
            this.mempoolClickedItem = this.mempoolSelectedItem;
          }
        } else {
          this.mempoolSelectedItem = null;
          this.mempoolClickedItem = null;
        }
      });

    // triger action and get mempool data
    this.store.dispatch({
      type: 'MEMPOOL_ACTION_LOAD',
    });

    // wait for data changes from redux
    this.store.select('networkAction')
      .pipe(untilDestroyed(this))
      .subscribe((data: NetworkAction) => {

        if (this.networkActionlastCursorId < data.lastCursorId) {

          // console.log('[networkAction]', this.networkActionlastCursorId, data.lastCursorId);
          this.networkActionlastCursorId = data.lastCursorId;

          setTimeout(() => {
            // this.viewPort.scrollTo({ bottom: 0 });
          });

        }

      });

  }

  // set clicked mempool item
  clickWallet(item: any) {
    this.mempoolClickedItem = item;
    this.mempoolSelectedItem = this.mempoolClickedItem;
  }

  // set temporary select item on hover
  tableMouseEnter(item: any) {
    this.mempoolSelectedItem = item;
  }

  // set clicked item again as selected on hover leave
  tableMouseLeave() {
    this.mempoolSelectedItem = this.mempoolClickedItem;
  }

  ngOnDestroy() {
    // stop streaming actions
    this.store.dispatch({
      type: 'MEMPOOL_ACTION_STOP'
    });
  }

}
