import {
  ChangeDetectorRef, ChangeDetectionStrategy, Component,
  ElementRef, Input, OnChanges, ViewChild, OnInit
} from '@angular/core';

import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil, delay } from 'rxjs/operators'

import * as d3 from 'd3';


@Component({
  selector: 'app-networking-history',
  templateUrl: './networking-history.component.html',
  styleUrls: ['./networking-history.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NetworkingHistoryComponent implements OnInit {

  public networkingHistory
  public networkingHistoryFormated
  public networkingHistoryPanel

  public networkingHistoryPanelShow = false
  public networkingStats
  public networkingHistoryConfig = {
    row_length: 32,
    row_height: 20,
    // color: {
    //   finishedBlocks: "#00dbc6",
    //   appliedBlocks: "#000000",
    //   empty: "#f2f2f2",
    //   border: "#f2f2f2",
    // }
    color: {
      finishedBlocks: "#000000",
      appliedBlocks: "#00dbc6",
      empty: "#f2f2f2",
      border: "lightgrey",
    }
  }

  public onDestroy$ = new Subject()

  constructor(
    private cd: ChangeDetectorRef,
    public store: Store<any>
  ) {


  }

  render() {
    this.cd.markForCheck();
  }

  ngOnInit() {

    // https://medium.com/netscape/visualizing-data-with-angular-and-d3-209dde784aeb
    // https://stackoverflow.com/questions/22295644/d3-js-appending-svg-dom-element-not-working
    // this.networkingHistoryPanel = d3.select("#networkingHistoryPanel g")

    // this.initBlockPanel();

    // wait for data changes from redux    
    this.store.select('networkingStats')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.networkingStats = data;

      })

    // wait for data changes from redux    
    this.store.select('networkingHistory')
      .pipe(
        takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.networkingHistory = data.ids.map(id => data.entities[id])

        const cyclesPerVotingPeriod = 8;
        const votingPeriodPerRow = 2;

        this.networkingHistoryFormated = []

        for (let cycle = 0; cycle < this.networkingHistory.length; ++cycle) {
          // get voting period
          let votingPeriod = Math.floor(cycle / cyclesPerVotingPeriod);
          // this value represetn position in voting period
          let votingPeriodPosition = cycle % cyclesPerVotingPeriod;
          // get voting period Row
          let votingPeriodRow = Math.floor(votingPeriod / votingPeriodPerRow);
          // voting periond row position 
          let votingPeriodRowPosition = votingPeriod % votingPeriodPerRow

          // create new element in array
          if (!this.networkingHistoryFormated[votingPeriodRow]) {
            this.networkingHistoryFormated[votingPeriodRow] = []
          }
          // create new element in array
          if (!this.networkingHistoryFormated[votingPeriodRow][votingPeriodRowPosition]) {
            this.networkingHistoryFormated[votingPeriodRow][votingPeriodRowPosition] = []
           

          }

          // save element
          this.networkingHistoryFormated[votingPeriodRow][votingPeriodRowPosition][votingPeriodPosition] = this.networkingHistory[cycle];

        }

        // this.cd.markForCheck();

        // // clean block pannel 
        // if (this.networkingHistory.ids.length === 0) {

        //   // remove all elements
        //   this.networkingHistoryPanel.selectAll("*").remove();

        //   // create blocks panel
        //   this.initBlockPanel();

        // }

        // this.networkingHistory.ids.map(id => {
        //   const row_length = 8;
        //   const x = (((this.networkingHistory.entities[id].id % this.networkingHistoryConfig.row_length) + Math.floor((this.networkingHistory.entities[id].id % this.networkingHistoryConfig.row_length) / 8)) * 20) + 2
        //   const y = (Math.floor(this.networkingHistory.entities[id].id / this.networkingHistoryConfig.row_length) * this.networkingHistoryConfig.row_height) + 2;

        //   // TODO: !!!!!!! refactor to support update 
        //   // https://stackoverflow.com/questions/14471923/d3-pattern-to-add-an-element-if-missing/14511399#14511399

        //   let block_header = d3.select("#block_header_" + id)

        //   if (block_header.empty()) {

        //     this.networkingHistoryPanel.append("rect")
        //       .attr("id", "block_header_" + id)
        //       .attr("opacity", 0)
        //       .attr("x", x)
        //       .attr("y", y)
        //       .attr("width", 16)
        //       .attr("height", 6)
        //       .attr("rx", 2)
        //       .attr("ry", 2)
        //       .attr("fill", this.networkingHistoryConfig.color.finishedBlocks);

        //   } else {

        //     block_header
        //       .attr("opacity", (this.networkingHistory.entities[id].headers / 4096).toFixed(2))

        //   }

        //   let block_operations = d3.select("#block_operations_" + id)

        //   if (block_operations.empty()) {

        //     this.networkingHistoryPanel.append("rect")
        //       .attr("id", "block_operations_" + id)
        //       .attr("opacity", 0)
        //       .attr("x", x)
        //       .attr("y", y + 4)
        //       .attr("width", 16)
        //       .attr("height", 12)
        //       .attr("rx", 2)
        //       .attr("ry", 2)
        //       .attr("fill", this.networkingHistoryConfig.color.finishedBlocks);

        //   } else {

        //     block_operations
        //       .attr("opacity", (this.networkingHistory.entities[id].operations / 4096).toFixed(2))
        //   }

        //   // we have all headers and operations in cycle ready for application
        //   if (this.networkingHistory.entities[id].operations === 4096) {
        //     // set yellow collor
        //     block_header.attr("fill", "#FFFFFF")
        //     block_operations.attr("fill", "#FFFFFF")

        //   }


        //   // block apply
        //   let block_apply = d3.select("#block_apply_" + id)

        //   if (block_apply.empty()) {

        //     this.networkingHistoryPanel.append("rect")
        //       .attr("id", "block_apply_" + id)
        //       .attr("opacity", 0)
        //       .attr("x", x)
        //       .attr("y", y)
        //       .attr("width", 16)
        //       .attr("height", 16)
        //       .attr("rx", 2)
        //       .attr("ry", 2)
        //       .attr("fill", this.networkingHistoryConfig.color.appliedBlocks);

        //   } else {

        //     block_apply
        //       .attr("opacity", (this.networkingHistory.entities[id].applications / 4096).toFixed(2))

        //   }


        // })


      })


  }

  ngOnDestroy() {

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

  // initialize block panel
  initBlockPanel() {

    console.log('[initBlockPanel]', this.networkingHistory);

    // TODO: completly refactor
    // this.networkingStats.currentBlockCount
    let cycles = Math.round(655000 / 4096)

    for (let id = 0; id < cycles; id++) {

      const x = (
        (
          (id % this.networkingHistoryConfig.row_length) + (Math.floor((id % this.networkingHistoryConfig.row_length) / 8))
        )
        * 20) + 2
      const y = (Math.floor(id / this.networkingHistoryConfig.row_length) * this.networkingHistoryConfig.row_height) + 2;

      this.networkingHistoryPanel.append("rect")
        .attr("opacity", 1)
        .attr("x", x)
        .attr("y", y)
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("width", 16)
        .attr("height", 16)
        // .attr("stroke", this.networkingHistoryConfig.color.border)
        // .attr("stroke-width", 1)
        .attr("fill", this.networkingHistoryConfig.color.empty)

    }

  }

}
