import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-commit-number',
  templateUrl: './commit-number.component.html',
  styleUrls: ['./commit-number.component.scss']
})
export class CommitNumberComponent implements OnInit, OnDestroy {

  onDestroy$ = new Subject();
  commitNumber: any;
  githubRepositories = {
    explorer: 'https://github.com/simplestaking/tezedge-explorer/commit/',
    node: 'https://github.com/simplestaking/tezedge/commit/',
    debugger: 'https://github.com/simplestaking/tezedge-debugger/commit/'
  };

  constructor(
    public store: Store<any>
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch({ type: 'VERSION_NODE_LOAD' });
    this.store.dispatch({ type: 'VERSION_DEBUGGER_LOAD' });

    this.store.select('commitNumber')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.commitNumber = data;
      });
  }

  ngOnDestroy() {
    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
