import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Inspector, Runtime } from '@observablehq/runtime';
import { TreeMapFactoryService } from '@shared/tree-map/tree-map-factory.service';
import { select, Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MemoryResource } from '@shared/types/resources/memory/memory-resource.type';
import { MemoryResourcesActionTypes, MemoryResourcesClose, MemoryResourcesLoad } from './memory-resources.actions';
import { delay, filter } from 'rxjs/operators';
import { memoryResources } from '@resources/resources/resources.reducer';
import { appState } from '@app/app.reducer';
import { App } from '@shared/types/app/app.type';

@UntilDestroy()
@Component({
  selector: 'app-memory-resources',
  templateUrl: './memory-resources.component.html',
  styleUrls: ['./memory-resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemoryResourcesComponent implements AfterViewInit, OnInit, OnDestroy {

  activeResource: MemoryResource;
  breadcrumbs: MemoryResource[] = [];

  private runtime: Runtime & { setup: any };
  private menuCollapsed: boolean;

  @ViewChild('treeMapChart') private treeMapRef: ElementRef<HTMLDivElement>;
  @ViewChild('breadcrumbsRef') private breadcrumbsRef: ElementRef<HTMLDivElement>;

  @HostListener('window:resize')
  onResize(): void {
    this.createTreemap(this.activeResource);
  }

  @HostListener('document:keydown.escape')
  onKeydownHandler(): void {
    if (this.breadcrumbs.length > 1) {
      this.zoomToNode(this.breadcrumbs[this.breadcrumbs.length - 2]);
    }
  }

  constructor(private zone: NgZone,
              private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private treeMapFactory: TreeMapFactoryService) { }

  ngOnInit(): void {
    this.loadResources();
    this.store.pipe(
      untilDestroyed(this),
      select(appState),
      filter(() => !!this.activeResource),
      delay(400),
    ).subscribe((app: App) => {
      if (this.menuCollapsed !== app.sidenav.collapsed) {
        this.createTreemap(this.activeResource);
      } else {
        this.loadResources();
      }
      this.menuCollapsed = app.sidenav.collapsed;
    });
  }

  private loadResources(): void {
    this.store.dispatch<MemoryResourcesLoad>({
      type: MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD,
      payload: { reversed: false }
    });
  }

  ngAfterViewInit(): void {
    this.store.pipe(
      untilDestroyed(this),
      select(memoryResources),
      filter(Boolean)
    ).subscribe((resource: MemoryResource) => {
      this.breadcrumbs = [];
      this.createTreemap(resource);
      this.setActiveResource(resource);
    });
  }

  private createTreemap(resource: MemoryResource): void {
    this.zone.runOutsideAngular(() => {
      this.removeD3Tooltip();
      const runtime = new Runtime();
      runtime.setup = {
        treeData: resource,
        containerRect: this.treeMapRef.nativeElement.getBoundingClientRect(),
        zoomNode: null,
        nodeZoomed: (node: MemoryResource) => this.setActiveResource(node)
      };
      runtime.module(this.treeMapFactory.define, name => {
        if (name === 'chart') {
          return new Inspector(this.treeMapRef.nativeElement);
        }
      });
      this.runtime = runtime;
    });
  }

  setActiveResource(resource: MemoryResource): void {
    this.activeResource = resource;
    if (this.breadcrumbs.includes(this.activeResource)) {
      const index = this.breadcrumbs.findIndex(bc => bc === this.activeResource);
      while (index !== this.breadcrumbs.length - 1) {
        this.breadcrumbs.splice(this.breadcrumbs.length - 1, 1);
      }
    } else {
      this.breadcrumbs.push(resource);
    }
    this.cdRef.detectChanges();
  }

  zoomToNode(operation: MemoryResource): void {
    if (!operation.children.length) {
      return;
    }
    this.setActiveResource(operation);
    this.runtime.setup.zoomNode(this.activeResource.name.executableName);
    setTimeout(() => this.breadcrumbsRef.nativeElement.scroll({ left: 10000, behavior: 'smooth' }), 10);
  }

  ngOnDestroy(): void {
    this.store.dispatch<MemoryResourcesClose>({
      type: MemoryResourcesActionTypes.MEMORY_RESOURCES_CLOSE
    });
    this.removeD3Tooltip();
  }

  private removeD3Tooltip(): void {
    const tooltip = document.querySelector('.d3-tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }
}
