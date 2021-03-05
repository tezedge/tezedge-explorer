import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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
  showCommitNumbers = false;

  hideComponent = false;

  @HostListener('mouseenter')
  mouseenter() {
    this.showCommitNumbers = true;
  }
  @HostListener('mouseleave')
  mouseleave() {
    this.showCommitNumbers = false;
  }

  constructor(
    public store: Store<any>
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch({ type: 'VERSION_NODE_TAG_LOAD' });
    this.store.dispatch({ type: 'VERSION_NODE_LOAD' });
    this.store.dispatch({ type: 'VERSION_DEBUGGER_LOAD' });

    this.store.select('commitNumber')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.commitNumber = data;
      });

    this.store.select('settingsNode')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.hideComponent = data.activeNode.id.includes('ocaml');
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
