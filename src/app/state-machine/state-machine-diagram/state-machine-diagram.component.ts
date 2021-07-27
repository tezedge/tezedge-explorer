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
  private stateMachine: StateMachine;

  private g: any;
  private svg: any;
  private svgGroup: any;

  private diagram: StateMachineDiagramBlock[];
  private collapsedDiagram: boolean;
  private diagramHeight: number = -1;

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
    this.store.dispatch<StateMachineCollapseDiagram>({
      type: StateMachineActionTypes.STATE_MACHINE_COLLAPSE_DIAGRAM
    });
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
    this.zone.runOutsideAngular(() => {
      d3.selectAll('#d3Diagram svg > *').remove();

      this.diagram.forEach(block => {
        // const cls = block.status
        //   + (block.type === 'error' ? ' error' : '')
        //   + (block.type === 'error' && block.status !== 'active' ? ' hidden-svg' : '');
        this.g.setNode(block.actionId, { // Create
          label: block.actionName,
          // class: cls,
          data: block,
          id: 'g' + block.actionId,
        });
      });

      this.diagram
        .filter(block => block.nextActions.length)
        .forEach(block => {
          block.nextActions.forEach((next, i) => {
            const isNextBlockAnError = this.diagram.find(b => b.actionId === next).type === 'error';
            this.g.setEdge(block.actionId, next, { // Connect
              arrowheadStyle: isNextBlockAnError ? 'display: none' : 'fill: #7f7f82; stroke: none',
              style: (isNextBlockAnError ? 'stroke: #e05537; stroke-dasharray: 5, 5;' : 'stroke: #7f7f82;') + 'fill: none',
              curve: curveBasis
            });
          });
        });

      this.g.nodes().forEach((v) => {
        const node = this.g.node(v);
        node.rx = node.ry = 5;
      });

      const render = new dagreD3.render();
      this.svg = d3.select('#d3Diagram svg');
      this.svgGroup = this.svg.append('g');

      render(d3.select('#d3Diagram svg g'), this.g); // Run the renderer. This is what draws the final graph.

      // this.toggleErrorStatesVisibilityOnHover();

      this.svg
        .attr('width', this.d3Diagram.nativeElement.offsetWidth)
        .attr('height', this.d3Diagram.nativeElement.offsetHeight);

      this.zoomToFit();
    });
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
      const nextBlockIds = this.diagram.find(bl => bl.actionId === Number(id)).nextActions;
      const nextErrorBlockIds = this.diagram.filter(bl => nextBlockIds.includes(bl.actionId) && bl.type === 'error');
      nextErrorBlockIds.forEach(bl => {
        d3.select('#d3Diagram svg g')
          .select(`#g${bl.actionId}`)
          .classed('hidden-svg', visible);
      });
    };

    const nodes = d3.select('#d3Diagram svg g').selectAll('g.node rect');
    nodes
      .on('mouseenter', (event, id: string) => toggleVisibilityOfErrorBlocks(id, false))
      .on('mouseleave', (event, id: string) => toggleVisibilityOfErrorBlocks(id, true));
  }

  private highlightActiveActionInDiagram(action: StateMachineAction): void {
    const gElement = d3.select('#d3Diagram svg g');
    const activeBlock = gElement.select('g.active');
    if (activeBlock) {
      activeBlock.classed('active', false);
    }
    gElement
      .select(`#g${action.id}`)
      .classed('active', true);
  }
}
