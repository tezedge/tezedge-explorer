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
import { TreeMapFactoryService } from '../../shared/tree-map/tree-map-factory.service';
import { select, Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MemoryResource } from '../../shared/types/resources/memory/memory-resource.type';
import { MemoryResourcesActionTypes } from './memory-resources.actions';
import { delay, filter } from 'rxjs/operators';

// @ts-ignore
import * as tree from './small-tree.json';

@UntilDestroy()
@Component({
  selector: 'app-memory-resources',
  templateUrl: './memory-resources.component.html',
  styleUrls: ['./memory-resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemoryResourcesComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild('treeMapChart') private treeMapRef: ElementRef<HTMLDivElement>;
  @ViewChild('breadcrumbsRef') private breadcrumbsRef: ElementRef<HTMLDivElement>;

  activeResource: MemoryResource;
  runtime: Runtime & { setup: any };
  breadcrumbs: MemoryResource[] = [];

  private serverData = (tree as any).default;

  @HostListener('window:resize')
  onResize(): void {
    this.createTreemap(this.activeResource);
  }

  constructor(private zone: NgZone,
              private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private treeMapFactory: TreeMapFactoryService) { }

  ngOnInit(): void {
    this.store.dispatch({ type: MemoryResourcesActionTypes.LoadResources, payload: { reversed: false } });
    this.store.pipe(
      untilDestroyed(this),
      select(state => state.app),
      filter(() => !!this.activeResource),
      delay(400)
    ).subscribe(() => this.createTreemap(this.activeResource));
  }

  ngAfterViewInit(): void {
    this.store.pipe(
      untilDestroyed(this),
      select(state => state.resources.memoryResources),
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
    this.store.dispatch({ type: MemoryResourcesActionTypes.ResourcesClose });
    this.removeD3Tooltip();
  }

  private removeD3Tooltip(): void {
    const tooltip = document.querySelector('.d3-tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }
}
