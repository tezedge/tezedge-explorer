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
  public networkingHistoryPanel
  public networkingStats

  public onDestroy$ = new Subject()

  constructor(
    private cd: ChangeDetectorRef,
    public store: Store<any>
  ) {


  }


  ngOnInit() {

    // https://medium.com/netscape/visualizing-data-with-angular-and-d3-209dde784aeb
    // https://stackoverflow.com/questions/22295644/d3-js-appending-svg-dom-element-not-working
    this.networkingHistoryPanel = d3.select("#networkingHistoryPanel g")

    this.initBlockPanel();

    // wait for data changes from redux    
    this.store.select('networkingStats')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.networkingStats = data;

      })


    // wait for data changes from redux    
    this.store.select('networkingHistory')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.networkingHistory = data

        // clean block pannel 
        if (this.networkingHistory.ids.length === 0) {
          
          // remove all elements
          svg.selectAll("*").remove();

          // create blocks panel
          this.initBlockPanel();
        }

        this.networkingHistory.ids.map(id => {

          const x = (((this.networkingHistory.entities[id].group % 32) + Math.floor((this.networkingHistory.entities[id].group % 32) / 8)) * 20) + 2
          const y = (Math.floor(this.networkingHistory.entities[id].group / 32) * 20) + 2;

          // TODO: !!!!!!! refactor to support update 
          // https://stackoverflow.com/questions/14471923/d3-pattern-to-add-an-element-if-missing/14511399#14511399

          let block_header = d3.select("#block_header_" + id)

          if (block_header.empty()) {

            this.networkingHistoryPanel.append("rect")
              .attr("id", "block_header_" + id)
              .attr("opacity", 0)
              .attr("x", x)
              .attr("y", y)
              .attr("width", 16)
              .attr("height", 6)
              .attr("rx", 2)
              .attr("ry", 2)
              .attr("fill", "black");

          } else {

            block_header
              .attr("opacity", (this.networkingHistory.entities[id].numbersOfBlocks / 4096).toFixed(2))

          }

          let block_operations = d3.select("#block_operations_" + id)

          if (block_operations.empty()) {

            this.networkingHistoryPanel.append("rect")
              .attr("id", "block_operations_" + id)
              .attr("opacity", 0)
              .attr("x", x)
              .attr("y", y + 4)
              .attr("width", 16)
              .attr("height", 12)
              .attr("rx", 2)
              .attr("ry", 2)
              .attr("fill", "black");


          } else {

            block_operations
              .attr("opacity", (this.networkingHistory.entities[id].finishedBlocks / 4096).toFixed(2))

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

  // initialize block panel
  initBlockPanel() {

    // TODO: completly refactor
    // this.networkingStats.currentBlockCount
    let cycles = Math.round(687903 / 4096)

    for (let id = 0; id < cycles; id++) {

      const x = (
        (
          (id % 32) + (Math.floor((id % 32) / 8))
        )
        * 20) + 2
      const y = (Math.floor(id / 32) * 20) + 2;

      this.networkingHistoryPanel.append("rect")
        .attr("opacity", 1)
        .attr("x", x)
        .attr("y", y)
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("width", 16)
        .attr("height", 16)
        .attr("stroke", "grey")
        .attr("stroke-width", 1)
        .attr("fill", "whitesmoke")

    }

  }

}
