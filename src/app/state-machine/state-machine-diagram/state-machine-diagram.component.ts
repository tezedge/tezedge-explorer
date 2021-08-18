import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StateMachineDiagramBlock } from '../../shared/types/state-machine/state-machine-diagram-block.type';
import { Store } from '@ngrx/store';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { StateMachineDiagramBlock } from '../../shared/types/state-machine/state-machine-diagram-block.type';
import { select, Store } from '@ngrx/store';
import { State } from '../../app.reducers';

import * as d3 from 'd3';
import * as dagreD3 from 'dagre-d3';
import { selectStateMachineDiagram } from '../state-machine/state-machine.reducer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { appState } from '../../app.reducer';
import { delay } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-state-machine-diagram',
  templateUrl: './state-machine-diagram.component.html',
  styleUrls: ['./state-machine-diagram.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMachineDiagramComponent implements AfterViewInit {

  @ViewChild('d3Diagram', { static: true }) private d3Diagram: ElementRef<HTMLDivElement>;

  @HostListener('window:resize')
  onResize(): void {
    this.generateDiagram();
  }

  constructor(private store: Store<State>) { }

  private g: any;
  private svg: any;
  private svgGroup: any;
  private diagram: StateMachineDiagramBlock[];

  ngAfterViewInit(): void {
    this.listenToDiagramChange();
  }

  private listenToDiagramChange(): void {
    this.g = new dagreD3.graphlib.Graph()
      .setGraph({})
      .setDefaultEdgeLabel(() => ({}));
    this.g.graph().rankDir = 'LR';

    this.store.select(selectStateMachineDiagram)
      .pipe(untilDestroyed(this))
      .subscribe((diagram: StateMachineDiagramBlock[]) => {
        this.diagram = diagram;
        this.generateDiagram();
      });

    this.store.pipe(
      untilDestroyed(this),
      select(appState),
      delay(400)
    ).subscribe(() => this.generateDiagram());
  }

  generateDiagram(): void {
    d3.selectAll('#d3Diagram svg > *').remove();

    this.diagram.forEach(block => {
      const cls = block.status
        + (block.type === 'error' ? ' error' : '')
        + (block.type === 'error' && block.status !== 'active' ? ' hidden-svg' : '');
      this.g.setNode(block.id, { // Create
        label: block.title,
        class: cls,
        data: block,
        id: 'g' + block.id,
      });
    });

    this.diagram
      .filter(block => block.next.length)
      .forEach(block => {
        block.next.forEach((next, i) => {
          const isNextBlockAnError = this.diagram.find(b => b.id === next).type === 'error';
          this.g.setEdge(block.id, next, { // Connect
            arrowheadStyle: isNextBlockAnError ? 'display: none' : 'fill: #7f7f82; stroke: none',
            style: (isNextBlockAnError ? 'stroke: #e05537; stroke-dasharray: 5, 5;' : 'stroke: #7f7f82;') + 'fill: none',
          });
        });
      });

    this.g.nodes().forEach((v) => {
      const node = this.g.node(v);
      node.rx = node.ry = 5;
      node.height = node.data.type === 'action' ? 4 : 16;
    });

    const render = new dagreD3.render();
    this.svg = d3.select('#d3Diagram svg');
    this.svgGroup = this.svg.append('g');

    render(d3.select('#d3Diagram svg g'), this.g); // Run the renderer. This is what draws the final graph.

    this.toggleErrorStatesVisibilityOnHover();

    this.svg
      .attr('width', this.d3Diagram.nativeElement.offsetWidth)
      .attr('height', this.d3Diagram.nativeElement.offsetHeight);

    this.zoomToFit();
  }

  zoomToFit(duration: number = 0): void {
    const zoom = d3.zoom().on('zoom', (event) => {
      this.svgGroup.attr('transform', event.transform);
    });
    this.svg.call(zoom);

    const graph = this.g.graph();
    const initialScale = Math.min(
      this.d3Diagram.nativeElement.offsetWidth / graph.width,
      this.d3Diagram.nativeElement.offsetHeight / graph.height
    ) - 0.02;
    const y = (Number(this.svg.attr('height')) - graph.height * initialScale) / 2;
    const x = (Number(this.svg.attr('width')) - graph.width * initialScale) / 2;
    const transform = d3.zoomIdentity
      .translate(x, y)
      .scale(initialScale);
    this.svg
      .transition()
      .duration(duration)
      .call(zoom.transform as any, transform);
  }

  private toggleErrorStatesVisibilityOnHover(): void {
    const toggleVisibilityOfErrorBlocks = (id: string, visible: boolean) => {
      const nextBlockIds = this.diagram.find(bl => bl.id === Number(id)).next;
      const nextErrorBlockIds = this.diagram.filter(bl => nextBlockIds.includes(bl.id) && bl.type === 'error');
      nextErrorBlockIds.forEach(bl => {
        d3.select('#d3Diagram svg g')
          .select(`#g${bl.id}`)
          .classed('hidden-svg', visible);
      });
    };

    const nodes = d3.select('#d3Diagram svg g').selectAll('g.node rect');
    nodes
      .on('mouseenter', (event, id: string) => toggleVisibilityOfErrorBlocks(id, false))
      .on('mouseleave', (event, id: string) => toggleVisibilityOfErrorBlocks(id, true));
  }
}
