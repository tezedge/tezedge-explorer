import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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

  private serverData = (tree as any).default;

  constructor(private zone: NgZone,
              private store: Store<State>,
              private treeMapFactory: TreeMapFactoryService) { }

  ngOnInit(): void {
    this.store.dispatch({ type: MemoryResourcesActionTypes.LoadResources });
  }

  ngAfterViewInit(): void {
    this.store.pipe(
      untilDestroyed(this),
      select(state => state.resources.memoryResources)
    ).subscribe(resources => {
      this.zone.runOutsideAngular(() => {
        const runtime = new Runtime();
        runtime.setup = {
          treeData: resources,
          containerRect: this.treeMapRef.nativeElement.getBoundingClientRect(),
        };
        runtime.module(this.treeMapFactory.define, name => {
          if (name === 'chart') {
            return new Inspector(this.treeMapRef.nativeElement);
          }
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch({ type: MemoryResourcesActionTypes.ResourcesClose });
  }

  zoomNode(nodeId: string): void {
    const found = this.findNodeByName(nodeId, null);
  }

  private findNodeByName(name: string, node: MemoryResource): MemoryResource {
    if (node.name === name) {
      return node;
    } else if (node.children) {
      let found = null;
      node.children.forEach(item => {
        if (!found) {
          found = this.findNodeByName(name, item);
        }
      });

      return found;
    }

    return null;
  }
}

const mock = {
  name: 'parent 123',
  children: [
    {
      name: 'child1342',
      children: [
        {
          name: 'child1342',
          value: 70,
          children: []
        },
        {
          name: 'child1342',
          value: 30,
          children: []
        },
        {
          name: 'child1342',
          value: 20,
          children: []
        },
      ]
    },
    {
      name: 'child1252',
      value: 20,
      children: []
    }
  ]
};
