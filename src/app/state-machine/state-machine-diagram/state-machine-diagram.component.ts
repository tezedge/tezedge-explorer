import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { StateMachineDiagramBlock } from '@shared/types/state-machine/state-machine-diagram-block.type';
import { select, Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import {
  selectStateMachine,
  selectStateMachineActiveAction,
  selectStateMachineCollapsedDiagram,
  selectStateMachineDiagramBlocks
} from '@state-machine/state-machine/state-machine.reducer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { appState } from '@app/app.reducer';
import { debounceTime, delay, distinctUntilChanged, filter, mergeMap, skip, tap } from 'rxjs/operators';
import * as d3 from 'd3';
import { curveBasis } from 'd3';
import * as dagreD3 from 'dagre-d3';
import { StateMachineAction } from '@shared/types/state-machine/state-machine-action.type';
import {
  StateMachineActionsStopStream,
  StateMachineActionTypes,
  StateMachineCollapseDiagram,
  StateMachineSetActiveAction,
  StateMachineStartPlaying,
  StateMachineStopPlaying
} from '@state-machine/state-machine/state-machine.actions';
import { StateMachine } from '@shared/types/state-machine/state-machine.type';
import { FormControl } from '@angular/forms';
import { StateMachineActionTableAutoscrollType } from '@shared/types/state-machine/state-machine-action-table.type';
import { Observable, of } from 'rxjs';
import { ZoomBehavior } from 'd3-zoom';
import { Selection } from 'd3-selection';

const DEFAULT_MARKER_HEIGHT = 6;


@UntilDestroy()
@Component({
  selector: 'app-state-machine-diagram',
  templateUrl: './state-machine-diagram.component.html',
  styleUrls: ['./state-machine-diagram.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateMachineDiagramComponent implements OnInit, AfterViewInit {

  @ViewChild('d3Diagram', { static: true }) private d3Diagram: ElementRef<HTMLDivElement>;

  stateMachine$: Observable<StateMachine>;
  formControl: FormControl;
  diagram: StateMachineDiagramBlock[];
  private stateMachine: StateMachine;

  private g: any;
  private svg: Selection<any, any, HTMLElement, any>;
  private svgGroup: any;
  private zoom: ZoomBehavior<Element, any>;

  private collapsedDiagram: boolean;
  private diagramHeight: number = -1;
  private previousHighlightedElements: any = {};

  constructor(private store: Store<State>,
              private zone: NgZone) { }

  ngOnInit(): void {
    this.stateMachine$ = this.store.select(selectStateMachine);
  }

  ngAfterViewInit(): void {
    this.formControl = new FormControl();
    this.formControl.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(200)
      )
      .subscribe(value => {
        this.pausePlaying();
        this.selectAction(this.stateMachine.actionTable.entities[value], 'any');
      });

    this.listenToDiagramChange();
  }

  selectPrevAction(): void {
    this.selectAction(this.stateMachine.actionTable.entities[this.stateMachine.activeAction.id - 1], 'up');
    this.pausePlaying();
  }

  selectNextAction(): void {
    this.selectAction(this.stateMachine.actionTable.entities[this.stateMachine.activeAction.id + 1], 'down');
    this.pausePlaying();
  }

  private pausePlaying(): void {
    if (this.stateMachine.isPlaying) {
      this.store.dispatch<StateMachineStopPlaying>({ type: StateMachineActionTypes.STATE_MACHINE_PAUSE_PLAYING });
    }
  }

  togglePlayPause(): void {
    if (this.stateMachine.isPlaying) {
      this.pausePlaying();
    } else {
      this.stopStream();
      this.store.dispatch<StateMachineStartPlaying>({ type: StateMachineActionTypes.STATE_MACHINE_START_PLAYING });
    }
  }

  selectAction(action: StateMachineAction, autoScroll: StateMachineActionTableAutoscrollType): void {
    if (this.stateMachine.activeAction !== action) {
      this.store.dispatch<StateMachineSetActiveAction>({
        type: StateMachineActionTypes.STATE_MACHINE_SET_ACTIVE_ACTION,
        payload: { action, autoScroll }
      });
      this.stopStream();
    }
  }

  stopStream(): void {
    if (this.stateMachine.actionTable.stream) {
      this.store.dispatch<StateMachineActionsStopStream>({
        type: StateMachineActionTypes.STATE_MACHINE_ACTIONS_STOP_STEAM
      });
    }
  }

  toggleDiagramCollapsing(): void {
    this.pausePlaying();
    this.zone.run(() =>
      this.store.dispatch<StateMachineCollapseDiagram>({
        type: StateMachineActionTypes.STATE_MACHINE_COLLAPSE_DIAGRAM
      })
    );
  }

  private listenToDiagramChange(): void {
    this.zone.runOutsideAngular(() => {
      this.g = new dagreD3.graphlib.Graph()
        .setGraph({})
        .setDefaultEdgeLabel(() => ({}));
      this.g.graph().rankDir = 'LR';
    });
    this.stateMachine$
      .pipe(
        untilDestroyed(this),
        tap(state => this.stateMachine = state),
        filter(state => this.diagram && this.diagramHeight !== state.diagramHeight),
      )
      .subscribe((state: StateMachine) => {
        this.collapsedDiagram = state.collapsedDiagram;
        this.diagramHeight = state.diagramHeight;
        if (!this.collapsedDiagram && this.diagram.length > 0) {
          this.generateDiagram();
        }
      });

    this.store.select(selectStateMachineDiagramBlocks)
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged()
      )
      .subscribe((blocks: StateMachineDiagramBlock[]) => {
        this.diagram = blocks;
        if (!this.collapsedDiagram && this.diagram.length > 0) {
          this.generateDiagram();
        }
      });

    this.zone.runOutsideAngular(() =>
      this.store.select(selectStateMachineActiveAction)
        .pipe(
          untilDestroyed(this),
          distinctUntilChanged(),
          filter(Boolean)
        )
        .subscribe((action: StateMachineAction) => {
          this.highlightActiveActionInDiagram(action);
        })
    );

    this.store.select(selectStateMachineCollapsedDiagram)
      .pipe(
        untilDestroyed(this),
        filter(value => this.collapsedDiagram !== value),
        distinctUntilChanged(),
        skip(1),
        mergeMap(collapsedDiagram =>
          of(collapsedDiagram).pipe(delay(collapsedDiagram !== this.collapsedDiagram ? 250 : 0))
        )
      )
      .subscribe((collapsedDiagram: boolean) => {
        this.collapsedDiagram = collapsedDiagram;
        if (!this.collapsedDiagram) {
          this.generateDiagram();
        }
      });

    this.store.pipe(
      untilDestroyed(this),
      select(appState),
      delay(400),
      skip(1)
    ).subscribe(() => this.generateDiagram());
  }

  @HostListener('window:resize')
  generateDiagram(): void {
    if (!this.diagram?.length) {
      return;
    }
    this.zone.runOutsideAngular(() => {
      d3.selectAll('#d3Diagram svg > *').remove();

      this.diagram.forEach(block => {
        this.g.setNode(block.actionId, { // Create
          label: block.actionKind,
          data: block,
          id: block.actionKind
        });
      });
      this.diagram
        .filter(block => block.nextActions.length)
        .forEach(block => {
          block.nextActions.forEach((next) => {
            const stateMachineDiagramBlock = this.diagram.find(b => b.actionId === next);
            if (stateMachineDiagramBlock) {
              const actionUniqueConnection = block.actionKind + '-' + stateMachineDiagramBlock.actionKind;
              this.g.setEdge(block.actionId, next, { // Connect
                arrowheadStyle: 'fill: #7f7f82; stroke: none',
                style: 'stroke: #7f7f82; fill: none',
                curve: curveBasis,
                id: 'a' + actionUniqueConnection,
                labelId: 'l' + actionUniqueConnection,
                label: ' '
              });
            }
          });
        });

      this.g.nodes().forEach(n => {
        const node = this.g.node(n);
        node.rx = node.ry = 5;
      });

      const render = new dagreD3.render();

      this.svg = d3.select('#d3Diagram svg');
      this.svgGroup = this.svg.append('g');

      render(d3.select('#d3Diagram svg g'), this.g); // Run the renderer. This is what draws the final graph.

      this.svg.selectAll('g .edgePaths .edgePath marker').attr('markerUnits', 'userSpaceOnUse').attr('markerWidth', 12);
      this.svg
        .attr('width', this.d3Diagram.nativeElement.offsetWidth)
        .attr('height', this.d3Diagram.nativeElement.offsetHeight);

      this.resetZoom();
    });
  }

  resetZoom(duration: number = 0): void {
    this.zoom = d3.zoom().on('zoom', e => this.svgGroup.attr('transform', e.transform));
    this.svg.call(this.zoom);
    this.svg.classed('active-block', false);

    const graph = this.g.graph();
    const zoomCoefficient = 0.005;
    const initialScale = Math.min(
      this.d3Diagram.nativeElement.offsetWidth / graph.width,
      this.d3Diagram.nativeElement.offsetHeight / graph.height
    ) - zoomCoefficient;
    const y = (Number(this.svg.attr('height')) - graph.height * initialScale) / 2;
    const x = (Number(this.svg.attr('width')) - graph.width * initialScale) / 2;
    this.executeZoom(x, y, initialScale, duration);
  }


  private executeZoom(x: number, y: number, scale: number, duration: number): void {
    const transform = d3.zoomIdentity
      .translate(x, y)
      .scale(scale);
    this.svg
      .transition()
      .duration(duration)
      .call(this.zoom.transform, transform);
  }

  zoomIn(): void {
    this.svg.transition().call(this.zoom.scaleBy, 2);
  }

  zoomOut(): void {
    this.svg.transition().call(this.zoom.scaleBy, 0.5);
  }

  private highlightActiveActionInDiagram(action: StateMachineAction): void {
    if (!this.diagram?.length) {
      return;
    }

    this.previousHighlightedElements.edgeLabel?.html(null);
    this.previousHighlightedElements.nextConnectionArrow?.classed('connection-next', false);
    this.previousHighlightedElements.prevConnectionArrow?.classed('connection-prev', false);
    this.previousHighlightedElements.prevConnectionArrow?.select('marker').attr('markerHeight', DEFAULT_MARKER_HEIGHT);
    this.previousHighlightedElements.nextConnectionArrow?.select('marker').attr('markerHeight', DEFAULT_MARKER_HEIGHT);

    const prevActiveAction = this.svgGroup.select('g.active');
    if (prevActiveAction) {
      prevActiveAction.classed('active', false);
    }
    const newActiveAction = this.svgGroup.select(`#${action.kind}`);
    newActiveAction.classed('active', true);

    this.svg.classed('active-block', true);

    const nextAction = this.stateMachine.actionTable.entities[action.id + 1];
    const prevAction = this.stateMachine.actionTable.entities[action.id - 1];

    if (nextAction) {
      const edgeLabel = d3.select(`svg g .edgeLabels g #l${action.kind}-${nextAction.kind} tspan`);
      const nextConnectionArrow = d3.select(`svg g .edgePaths #a${action.kind}-${nextAction.kind}`);

      edgeLabel.html(action.duration.split('span').join('tspan'));
      nextConnectionArrow.classed('connection-next', true);
      nextConnectionArrow.select('marker').attr('markerHeight', 10);

      this.previousHighlightedElements.edgeLabel = edgeLabel;
      this.previousHighlightedElements.nextConnectionArrow = nextConnectionArrow;
    }

    if (prevAction) {
      const prevConnectionArrow = d3.select(`svg g .edgePaths #a${prevAction.kind}-${action.kind}`);
      prevConnectionArrow.classed('connection-prev', true);
      prevConnectionArrow.select('marker').attr('markerHeight', 10);

      this.previousHighlightedElements.prevConnectionArrow = prevConnectionArrow;
    }

    this.focusCurrentAction(newActiveAction);
  }

  private focusCurrentAction(source: Selection<any, any, HTMLElement, any>): void {
    const scale = 1;
    const xTransform = source.node().transform.baseVal[0].matrix.e;
    const yTransform = source.node().transform.baseVal[0].matrix.f;
    const x = xTransform * -scale + this.d3Diagram.nativeElement.offsetWidth / 2;
    const y = yTransform * -scale + this.d3Diagram.nativeElement.offsetHeight / 2;

    this.executeZoom(x, y, scale, 750);
  }
}
