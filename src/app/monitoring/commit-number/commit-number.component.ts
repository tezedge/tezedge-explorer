import { ChangeDetectionStrategy, Component, HostListener, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { CommitNumber } from '../../shared/types/commit-number/commit-number.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { State } from '../../app.reducers';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { selectActiveNode } from '../../settings/settings-node/settings-node.reducer';
import { SettingsNodeApi } from '../../shared/types/settings-node/settings-node-api.type';
import { filter } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-commit-number',
  templateUrl: './commit-number.component.html',
  styleUrls: ['./commit-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommitNumberComponent implements OnInit {

  commitNumber$: Observable<CommitNumber>;
  readonly githubRepositories = {
    explorer: 'https://github.com/tezedge/tezedge-explorer/commit/',
    node: 'https://github.com/tezedge/tezedge/commit/',
    debugger: 'https://github.com/tezedge/tezedge-debugger/commit/'
  };
  hideComponent = false;

  private currentNodeId: string;
  private overlayRef: OverlayRef;

  @ViewChild('versionTooltip') private versionTooltip: TemplateRef<void>;

  @HostListener('window:click')
  onDomClick(): void {
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.detachTooltip();
    }
  }

  constructor(private store: Store<State>,
              private overlay: Overlay,
              private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    this.commitNumber$ = this.store.select('commitNumber')
      .pipe(untilDestroyed(this));

    this.store.pipe(
      untilDestroyed(this),
      select(selectActiveNode),
      filter(node => node.id !== this.currentNodeId)
    ).subscribe((activeNode: SettingsNodeApi) => {
      this.currentNodeId = activeNode.id;

      const commit = activeNode.features.find(f => f.name === 'commit');
      this.store.dispatch({ type: 'VERSION_EXPLORER_LOAD', payload: commit ? commit.id : '' });
      this.store.dispatch({ type: 'VERSION_NODE_TAG_LOAD' });
      this.store.dispatch({ type: 'VERSION_NODE_LOAD' });
      if (activeNode.features.some(f => f.name === 'debugger')) {
        this.store.dispatch({ type: 'VERSION_DEBUGGER_LOAD' });
      }
    });

    // TODO: commitNumber for octez is not the same, find a solution
    this.store.select('settingsNode')
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        this.hideComponent = data.activeNode.type === 'octez';
      });
  }

  attachTooltip(event: MouseEvent): void {
    event.stopPropagation();

    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.detachTooltip();
      return;
    }

    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(event.target as HTMLElement)
        .withPositions([{
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetX: 0,
          offsetY: 0
        }])
    });

    const portal = new TemplatePortal(this.versionTooltip, this.viewContainerRef);
    this.overlayRef.attach(portal);
  }

  private detachTooltip(): void {
    this.overlayRef.detach();
  }
}
