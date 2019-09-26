import {
  ChangeDetectorRef, ChangeDetectionStrategy, Component,
  ElementRef, Input, OnChanges, ViewChild, OnInit
} from '@angular/core';

import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import * as d3 from 'd3';


@Component({
  selector: 'app-networking-history',
  templateUrl: './networking-history.component.html',
  styleUrls: ['./networking-history.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NetworkingHistoryComponent implements OnInit {

  public networkingHistory
  public networkingHistoryOpacity
  public onDestroy$ = new Subject()

  constructor(
    private cd: ChangeDetectorRef,
    public store: Store<any>
  ) { }

  ngOnInit() {

    // https://medium.com/netscape/visualizing-data-with-angular-and-d3-209dde784aeb
    // https://stackoverflow.com/questions/22295644/d3-js-appending-svg-dom-element-not-working
    var svg = d3.select("#networkingHistoryPanel g")

    // svg.append("rect")
    //   .attr("opacity", 1)
    //   .attr("x", 0)
    //   .attr("y", 0)
    //   .attr("rx", 2)
    //   .attr("ry", 2)
    //   .attr("width", 15)
    //   .attr("height", 15);

    // svg.style("fill", "green")

    // wait for data changes from redux    
    this.store.select('networkingHistory')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.networkingHistory = data

        // TODO: remove 
        // svg.selectAll("*").remove();

        this.networkingHistory.ids.map(id => {

          const x = ((this.networkingHistory.entities[id].group % 32) * 20)
          const y = (Math.round(this.networkingHistory.entities[id].group / 32) * 20);

          // TODO: !!!!!!! refactor to support update 
          // https://stackoverflow.com/questions/14471923/d3-pattern-to-add-an-element-if-missing/14511399#14511399

          let block_header = d3.select("#block_header_" + id)

          if (block_header.empty()) {

            svg.append("rect").attr("id", "block_header_" + id)

          } else {

            block_header
              .attr("opacity", (this.networkingHistory.entities[id].numbersOfBlocks / 4096).toFixed(2))
              .attr("x", x)
              .attr("y", y)
              .attr("width", 16)
              .attr("height", 4)
              .attr("fill", "black");

          }


          let block_operations = d3.select("#block_operations_" + id)

          if (block_operations.empty()) {

            svg.append("rect").attr("id", "block_operations_" + id)

          } else {

            block_operations
              .attr("opacity", (this.networkingHistory.entities[id].finishedBlocks / 4096).toFixed(2))
              .attr("x", x)
              .attr("y", y + 4 )
              .attr("width", 16)
              .attr("height", 8)
              .attr("fill", "black");

          }


        })

        this.cd.markForCheck();

      })


  }

  ngOnDestroy() {

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
