import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { GithubVersion } from '@shared/types/github-version/github-version.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { State } from '@app/app.index';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { selectActiveNode } from '@settings/settings-node.reducer';
import { SettingsNodeApi } from '@shared/types/settings-node/settings-node-api.type';
import { filter } from 'rxjs/operators';
import {
  GITHUB_VERSION_DEBUGGER_LOAD,
  GITHUB_VERSION_EXPLORER_LOAD,
  GITHUB_VERSION_NODE_LOAD,
  GITHUB_VERSION_NODE_TAG_LOAD,
  GithubVersionDebuggerLoad,
  GithubVersionExplorerLoad,
  GithubVersionNodeLoad,
  GithubVersionNodeTagLoad
} from '@app/layout/github-version/github-version.actions';

@UntilDestroy()
@Component({
  selector: 'app-github-version',
  templateUrl: './github-version.component.html',
  styleUrls: ['./github-version.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GithubVersionComponent implements OnInit {

  readonly githubRepositories = {
    node: 'https://github.com/tezedge/tezedge/commit/',
    explorer: 'https://github.com/tezedge/tezedge-explorer/commit/',
    debugger: 'https://github.com/tezedge/tezedge-debugger/commit/'
  };

  githubVersion$: Observable<GithubVersion>;
  hideComponent = false;

  private currentNodeId: string;
  private overlayRef: OverlayRef;

  @ViewChild('versionTooltip') private versionTooltip: TemplateRef<void>;

  @HostListener('window:click')
  onDomClick(): void {
    if (this.overlayRef?.hasAttached()) {
      this.detachTooltip();
    }
  }

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private overlay: Overlay,
              private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    this.githubVersion$ = this.store.select('githubVersion')
      .pipe(untilDestroyed(this));

    this.store.pipe(
      untilDestroyed(this),
      select(selectActiveNode),
      filter(node => node?.id !== this.currentNodeId)
    ).subscribe((activeNode: SettingsNodeApi) => {
      this.currentNodeId = activeNode.id;
      if (activeNode.type === 'tezedge') {
        const commit = activeNode.features.find(f => f.name === 'commit');
        this.store.dispatch<GithubVersionExplorerLoad>({ type: GITHUB_VERSION_EXPLORER_LOAD, payload: commit ? commit.id : '' });
        this.store.dispatch<GithubVersionNodeTagLoad>({ type: GITHUB_VERSION_NODE_TAG_LOAD });
        this.store.dispatch<GithubVersionNodeLoad>({ type: GITHUB_VERSION_NODE_LOAD });
        if (activeNode.features.some(f => f.name === 'debugger')) {
          // this.store.dispatch<GithubVersionDebuggerLoad>({ type: GITHUB_VERSION_DEBUGGER_LOAD }); -- this is not working
        }
      }
      this.cdRef.detectChanges();
    });

    // TODO: commitNumber for octez is not the same, find a solution
    this.store.select('settingsNode')
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        this.hideComponent = data.activeNode.type === 'octez';
        this.cdRef.detectChanges();
      });
  }

  attachTooltip(event: MouseEvent): void {
    event.stopPropagation();

    if (this.overlayRef?.hasAttached()) {
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
