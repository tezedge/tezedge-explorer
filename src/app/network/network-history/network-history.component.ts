import {
  ChangeDetectorRef, ChangeDetectionStrategy, Component,
  ElementRef, Input, OnChanges, ViewChild, OnInit
} from '@angular/core';

import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil, delay } from 'rxjs/operators'

import * as d3 from 'd3';


@Component({
  selector: 'app-network-history',
  templateUrl: './network-history.component.html',
  styleUrls: ['./network-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NetworkHistoryComponent implements OnInit {

  public networkHistory
  public networkHistoryFormated
  public networkHistoryPanel

  public networkHistoryPanelShow = false
  public networkStats
  public networkHistoryConfig = {
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
    // this.networkHistoryPanel = d3.select("#networkHistoryPanel g")

    // this.initBlockPanel();

    // wait for data changes from redux    
    this.store.select('networkStats')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.networkStats = data;

      })

    // wait for data changes from redux    
    this.store.select('networkHistory')
      .pipe(
        takeUntil(this.onDestroy$))
      .subscribe(data => {

        this.networkHistory = data.ids.map(id => data.entities[id])
        
        // this.networkHistory = this.networkHistory.concat(this.networkHistory);

        const cyclesPerVotingPeriod = 8;
        const votingPeriodPerRow = 2;

        this.networkHistoryFormated = []

        for (let cycle = 0; cycle < this.networkHistory.length; ++cycle) {
          // get voting period
          let votingPeriod = Math.floor(cycle / cyclesPerVotingPeriod);
          // this value represetn position in voting period
          let votingPeriodPosition = cycle % cyclesPerVotingPeriod;
          // get voting period Row
          let votingPeriodRow = Math.floor(votingPeriod / votingPeriodPerRow);
          // voting periond row position 
          let votingPeriodRowPosition = votingPeriod % votingPeriodPerRow

          // create new element in array
          if (!this.networkHistoryFormated[votingPeriodRow]) {
            this.networkHistoryFormated[votingPeriodRow] = []
          }
          // create new element in array
          if (!this.networkHistoryFormated[votingPeriodRow][votingPeriodRowPosition]) {
            this.networkHistoryFormated[votingPeriodRow][votingPeriodRowPosition] = []
           

          }

          // save element
          this.networkHistoryFormated[votingPeriodRow][votingPeriodRowPosition][votingPeriodPosition] = this.networkHistory[cycle];

        }

        this.cd.markForCheck();

        // // clean block pannel 
        // if (this.networkHistory.ids.length === 0) {

        //   // remove all elements
        //   this.networkHistoryPanel.selectAll("*").remove();

        //   // create blocks panel
        //   this.initBlockPanel();

        // }

        // this.networkHistory.ids.map(id => {
        //   const row_length = 8;
        //   const x = (((this.networkHistory.entities[id].id % this.networkHistoryConfig.row_length) + Math.floor((this.networkHistory.entities[id].id % this.networkHistoryConfig.row_length) / 8)) * 20) + 2
        //   const y = (Math.floor(this.networkHistory.entities[id].id / this.networkHistoryConfig.row_length) * this.networkHistoryConfig.row_height) + 2;

        //   // TODO: !!!!!!! refactor to support update 
        //   // https://stackoverflow.com/questions/14471923/d3-pattern-to-add-an-element-if-missing/14511399#14511399

        //   let block_header = d3.select("#block_header_" + id)

        //   if (block_header.empty()) {

        //     this.networkHistoryPanel.append("rect")
        //       .attr("id", "block_header_" + id)
        //       .attr("opacity", 0)
        //       .attr("x", x)
        //       .attr("y", y)
        //       .attr("width", 16)
        //       .attr("height", 6)
        //       .attr("rx", 2)
        //       .attr("ry", 2)
        //       .attr("fill", this.networkHistoryConfig.color.finishedBlocks);

        //   } else {

        //     block_header
        //       .attr("opacity", (this.networkHistory.entities[id].headers / 4096).toFixed(2))

        //   }

        //   let block_operations = d3.select("#block_operations_" + id)

        //   if (block_operations.empty()) {

        //     this.networkHistoryPanel.append("rect")
        //       .attr("id", "block_operations_" + id)
        //       .attr("opacity", 0)
        //       .attr("x", x)
        //       .attr("y", y + 4)
        //       .attr("width", 16)
        //       .attr("height", 12)
        //       .attr("rx", 2)
        //       .attr("ry", 2)
        //       .attr("fill", this.networkHistoryConfig.color.finishedBlocks);

        //   } else {

        //     block_operations
        //       .attr("opacity", (this.networkHistory.entities[id].operations / 4096).toFixed(2))
        //   }

        //   // we have all headers and operations in cycle ready for application
        //   if (this.networkHistory.entities[id].operations === 4096) {
        //     // set yellow collor
        //     block_header.attr("fill", "#FFFFFF")
        //     block_operations.attr("fill", "#FFFFFF")

        //   }


        //   // block apply
        //   let block_apply = d3.select("#block_apply_" + id)

        //   if (block_apply.empty()) {

        //     this.networkHistoryPanel.append("rect")
        //       .attr("id", "block_apply_" + id)
        //       .attr("opacity", 0)
        //       .attr("x", x)
        //       .attr("y", y)
        //       .attr("width", 16)
        //       .attr("height", 16)
        //       .attr("rx", 2)
        //       .attr("ry", 2)
        //       .attr("fill", this.networkHistoryConfig.color.appliedBlocks);

        //   } else {

        //     block_apply
        //       .attr("opacity", (this.networkHistory.entities[id].applications / 4096).toFixed(2))

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

    console.log('[initBlockPanel]', this.networkHistory);

    // TODO: completly refactor
    // this.networkStats.currentBlockCount
    let cycles = Math.round(655000 / 4096)

    for (let id = 0; id < cycles; id++) {

      const x = (
        (
          (id % this.networkHistoryConfig.row_length) + (Math.floor((id % this.networkHistoryConfig.row_length) / 8))
        )
        * 20) + 2
      const y = (Math.floor(id / this.networkHistoryConfig.row_length) * this.networkHistoryConfig.row_height) + 2;

      this.networkHistoryPanel.append("rect")
        .attr("opacity", 1)
        .attr("x", x)
        .attr("y", y)
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("width", 16)
        .attr("height", 16)
        // .attr("stroke", this.networkHistoryConfig.color.border)
        // .attr("stroke-width", 1)
        .attr("fill", this.networkHistoryConfig.color.empty)

    }

  }

}
