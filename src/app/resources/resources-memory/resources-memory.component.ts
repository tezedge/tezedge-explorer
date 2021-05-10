import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import * as d3 from 'd3';
import Treemap, { Node, TreemapChartInstance } from 'treemap-chart';


// @ts-ignore
import * as tree from './tree.json';
// import { Runtime, Inspector } from '@observablehq/runtime';
// import { setTreeData } from '../../../assets/js/treemap';
//
// declare var define: any;

@Component({
  selector: 'app-resources-memory',
  templateUrl: './resources-memory.component.html',
  styleUrls: ['./resources-memory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesMemoryComponent implements AfterViewInit, AfterContentInit {

  @ViewChild('treeMapChart') private treeMapRef: ElementRef<HTMLDivElement>;
  treeMapChart: TreemapChartInstance;

  private serverData = (tree as any).default;

  constructor() {
  }

  ngAfterContentInit() {
    // console.log(define)
    // const runtime = new Runtime();
    // const main = runtime.module(define, Inspector.into(this.treeMapRef.nativeElement));

    // const runtime = new Runtime();
    // const main = runtime.module(define);
    // main.value('foo').then(value => console.log(value));
    // Runtime.load(define, Inspector.into(this.treeMapRef.nativeElement));


  }

  ngAfterViewInit(): void {
    // this.initTreeMapChart();
    // this.parse();
    // const runtime = new Runtime();
    // setTreeData(this.serverData);
    // const main = runtime.module(define, Inspector.into(this.treeMapRef.nativeElement));

  }

  private initTreeMapChart(): void {
    this.treeMapChart = Treemap();
    const color = d3.scaleOrdinal(d3.schemePaired);
    this.parse();
    console.log(JSON.stringify(this.serverData));
    this.treeMapChart.data(this.serverData)
      .width(this.treeMapRef.nativeElement.offsetWidth)
      .height(this.treeMapRef.nativeElement.offsetHeight)
      .color(d => color(d.name))
      .showLabels(true)
      .minBlockArea(10)
      .tooltipContent((d, node) => `Size: <i>${ node.value }</i>`)
      (this.treeMapRef.nativeElement);

    this.treeMapChart.onClick((node: Node) => {
      this.treeMapChart.zoomToNode(node);
    });
  }

  zoomNode(nodeId: string): void {
    const nodeName = nodeId;
    const found = this.findNodeByName(nodeName, this.treeMapChart.data());
    console.log(found);
    this.treeMapChart.zoomToNode(found);
  }

  private findNodeByName(name: string, node: Node): Node {
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

  parse(): void {
    const final: Node = {
      name: 'root',
      children: this.build(this.serverData.frames)
    };
    this.serverData = final;
    console.log(final);
  }

  build(entity: any): Node[] {
    const children = [];
    Object.keys(entity).forEach(key => {
      const items: any = { name: key };

      items.value = entity[key].value;
      if (isEmpty(entity[key].frames)) {
        items.value = entity[key].value;
      } else {
        items.children = this.build(entity[key].frames);
      }

      children.push(items);
    });
    return children;
  }
}

function isEmpty(obj) {
  for (const i in obj) {
    return false;
  }
  return true;
}


const mock = {
  name: 'parent 123',
  value: 111,
  children: [
    {
      name: 'child1342',
      value: 1000000,
      children: []
    },
    {
      name: 'child1252',
      value: 3242352,
      children: []
    }
  ]
};

// const mock = JSON.parse('{"name":"DIR #348","children":[{"name":"DIR #426","children":[{"name":"DIR #831","children":[{"name":"DIR #386","value":328},{"name":"DIR #692","children":[]},{"name":"DIR #951","value":916},{"name":"DIR #760","value":191}]},{"name":"DIR #817","children":[{"name":"DIR #466","value":193},{"name":"DIR #175","value":400},{"name":"DIR #267","value":608},{"name":"DIR #966","value":927},{"name":"DIR #840","value":354},{"name":"DIR #911","children":[{"name":"DIR #94","value":737},{"name":"DIR #452","value":692},{"name":"DIR #465","children":[{"name":"DIR #681","value":705},{"name":"DIR #68","value":882}]}]}]},{"name":"DIR #145","value":47},{"name":"DIR #786","value":150}]},{"name":"DIR #741","children":[{"name":"DIR #861","children":[{"name":"DIR #946","value":557},{"name":"DIR #733","value":549},{"name":"DIR #780","children":[{"name":"DIR #996","children":[{"name":"DIR #937","value":767},{"name":"DIR #688","children":[{"name":"DIR #936","value":360},{"name":"DIR #895","value":295},{"name":"DIR #437","value":473},{"name":"DIR #849","value":441},{"name":"DIR #31","value":816},{"name":"DIR #335","value":693},{"name":"DIR #407","value":925}]},{"name":"DIR #717","value":368},{"name":"DIR #961","value":475},{"name":"DIR #838","children":[{"name":"DIR #673","value":635},{"name":"DIR #733","value":117},{"name":"DIR #908","value":162},{"name":"DIR #885","value":918},{"name":"DIR #269","value":464},{"name":"DIR #648","value":741},{"name":"DIR #640","value":8},{"name":"DIR #466","value":361}]},{"name":"DIR #343","value":264}]},{"name":"DIR #756","children":[{"name":"DIR #251","value":262},{"name":"DIR #144","value":57},{"name":"DIR #686","children":[]},{"name":"DIR #949","value":192},{"name":"DIR #256","value":336}]},{"name":"DIR #933","children":[{"name":"DIR #784","value":366},{"name":"DIR #84","value":752}]}]},{"name":"DIR #365","value":134},{"name":"DIR #85","value":835}]},{"name":"DIR #945","value":541}]},{"name":"DIR #585","children":[{"name":"DIR #423","children":[{"name":"DIR #277","children":[{"name":"DIR #52","value":8},{"name":"DIR #547","children":[{"name":"DIR #154","children":[{"name":"DIR #435","value":848},{"name":"DIR #71","value":309},{"name":"DIR #315","value":432},{"name":"DIR #748","value":754},{"name":"DIR #868","value":661}]}]},{"name":"DIR #729","children":[{"name":"DIR #569","value":659},{"name":"DIR #395","value":270},{"name":"DIR #686","value":75}]},{"name":"DIR #135","value":885},{"name":"DIR #653","value":371},{"name":"DIR #799","children":[{"name":"DIR #237","value":1},{"name":"DIR #22","children":[{"name":"DIR #352","value":577},{"name":"DIR #106","value":53},{"name":"DIR #868","value":575}]},{"name":"DIR #220","value":126}]},{"name":"DIR #915","children":[{"name":"DIR #410","value":139},{"name":"DIR #772","value":669},{"name":"DIR #943","value":990}]}]},{"name":"DIR #521","children":[{"name":"DIR #474","value":815},{"name":"DIR #883","value":41},{"name":"DIR #476","children":[{"name":"DIR #449","value":38},{"name":"DIR #640","value":251},{"name":"DIR #383","children":[{"name":"DIR #778","value":327}]},{"name":"DIR #671","value":775},{"name":"DIR #198","value":719},{"name":"DIR #817","value":272},{"name":"DIR #413","value":98}]},{"name":"DIR #608","value":694}]},{"name":"DIR #488","value":349},{"name":"DIR #928","value":611},{"name":"DIR #739","children":[]}]},{"name":"DIR #469","value":612},{"name":"DIR #938","children":[{"name":"DIR #82","children":[{"name":"DIR #298","children":[{"name":"DIR #18","value":595}]},{"name":"DIR #772","children":[{"name":"DIR #858","value":987},{"name":"DIR #387","value":869},{"name":"DIR #938","value":671},{"name":"DIR #324","children":[{"name":"DIR #894","value":236},{"name":"DIR #414","value":310},{"name":"DIR #517","children":[{"name":"DIR #320","value":159},{"name":"DIR #45","value":626},{"name":"DIR #820","value":170},{"name":"DIR #59","value":811},{"name":"DIR #209","value":267},{"name":"DIR #707","value":134},{"name":"DIR #684","value":206}]},{"name":"DIR #732","children":[]},{"name":"DIR #534","value":344}]}]}]}]},{"name":"DIR #945","children":[{"name":"DIR #857","children":[{"name":"DIR #897","value":69},{"name":"DIR #540","children":[{"name":"DIR #186","value":765},{"name":"DIR #223","value":833}]},{"name":"DIR #164","value":286},{"name":"DIR #744","children":[{"name":"DIR #520","value":393},{"name":"DIR #592","value":785}]},{"name":"DIR #891","value":897},{"name":"DIR #803","value":987},{"name":"DIR #728","value":288},{"name":"DIR #491","children":[{"name":"DIR #468","value":416},{"name":"DIR #586","value":538}]}]},{"name":"DIR #522","value":630},{"name":"DIR #997","children":[{"name":"DIR #101","children":[{"name":"DIR #747","children":[{"name":"DIR #728","value":181},{"name":"DIR #516","value":317},{"name":"DIR #519","value":395}]},{"name":"DIR #744","value":727},{"name":"DIR #129","value":638},{"name":"DIR #468","value":121},{"name":"DIR #315","children":[{"name":"DIR #142","value":672}]},{"name":"DIR #305","value":152}]},{"name":"DIR #465","value":308},{"name":"DIR #729","children":[{"name":"DIR #453","value":23}]},{"name":"DIR #992","children":[{"name":"DIR #99","children":[{"name":"DIR #481","children":[{"name":"DIR #44","value":619},{"name":"DIR #16","value":484}]},{"name":"DIR #23","value":211},{"name":"DIR #799","value":570},{"name":"DIR #309","value":192},{"name":"DIR #799","value":69},{"name":"DIR #266","value":459},{"name":"DIR #792","value":261}]},{"name":"DIR #617","value":572}]},{"name":"DIR #525","value":78},{"name":"DIR #303","children":[{"name":"DIR #180","value":16},{"name":"DIR #864","children":[{"name":"DIR #210","value":358},{"name":"DIR #56","value":350},{"name":"DIR #118","value":356},{"name":"DIR #517","value":959}]},{"name":"DIR #966","children":[{"name":"DIR #5","value":670},{"name":"DIR #138","value":427},{"name":"DIR #768","value":539},{"name":"DIR #165","value":270},{"name":"DIR #214","value":246},{"name":"DIR #450","value":0},{"name":"DIR #481","value":876},{"name":"DIR #298","value":96}]}]},{"name":"DIR #765","value":694}]},{"name":"DIR #893","value":781},{"name":"DIR #221","children":[{"name":"DIR #413","value":590},{"name":"DIR #463","value":437},{"name":"DIR #941","value":105},{"name":"DIR #841","value":579},{"name":"DIR #578","value":19},{"name":"DIR #472","value":559}]},{"name":"DIR #221","children":[{"name":"DIR #103","value":968},{"name":"DIR #188","value":127},{"name":"DIR #789","value":238},{"name":"DIR #94","value":244},{"name":"DIR #633","value":796}]},{"name":"DIR #462","children":[{"name":"DIR #53","children":[{"name":"DIR #219","value":732},{"name":"DIR #68","value":844},{"name":"DIR #434","value":801},{"name":"DIR #64","value":41},{"name":"DIR #78","children":[{"name":"DIR #895","value":126},{"name":"DIR #300","value":305}]}]},{"name":"DIR #837","children":[{"name":"DIR #28","children":[{"name":"DIR #291","value":908},{"name":"DIR #630","value":336},{"name":"DIR #893","value":600},{"name":"DIR #181","value":585},{"name":"DIR #384","value":208},{"name":"DIR #670","value":699}]},{"name":"DIR #658","value":978},{"name":"DIR #727","value":326},{"name":"DIR #43","value":502},{"name":"DIR #831","children":[{"name":"DIR #388","value":446}]}]},{"name":"DIR #85","value":691},{"name":"DIR #233","value":645}]}]}]}]}');
