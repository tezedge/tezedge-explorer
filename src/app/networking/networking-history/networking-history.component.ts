import {
  ChangeDetectorRef, ChangeDetectionStrategy, Component,
  ElementRef, Input, OnChanges, ViewChild, OnInit
} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-networking-history',
  templateUrl: './networking-history.component.html',
  styleUrls: ['./networking-history.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NetworkingHistoryComponent implements OnInit {

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {

    // https://medium.com/netscape/visualizing-data-with-angular-and-d3-209dde784aeb
    // https://stackoverflow.com/questions/22295644/d3-js-appending-svg-dom-element-not-working
    var svg = d3.select("#svg")

    // svg.style("fill", "red")

    svg.append("rect")
      .attr("x", 20)
      .attr("y", 0)
      .attr("width", 15)
      .attr("height", 15);

    svg.append("rect")
      .attr("x", 40)
      .attr("y", 0)
      .attr("width", 15)
      .attr("height", 15);

    // this.cd.markForCheck();

  }

}
