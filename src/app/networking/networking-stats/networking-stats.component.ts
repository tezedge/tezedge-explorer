import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { NgxChartsModule } from '@swimlane/ngx-charts';
import * as shape from 'd3-shape';

@Component({
  selector: 'app-networking-stats',
  templateUrl: './networking-stats.component.html',
  styleUrls: ['./networking-stats.component.css']
})
export class NetworkingStatsComponent implements OnInit {

  single = [
    {
      'name': 'Saint Pierre and Miquelon',
      'series': []
    }
  ];

  // view: any[] = [700, 150];

  // options
  public showXAxis = false;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = false;
  public xAxisLabel = 'Bandwidth';
  public showYAxisLabel = false;
  public yAxisLabel = 'Time';
  public curve = shape.curveBasis // shape.curveLinear;
  // public curve = shape.curveLinear;

  public colorScheme =
    {
      name: 'vivid',
      selectable: true,
      group: 'Ordinal',
      domain: [
        '#000000', '#3f51b5', '#2196f3', '#00b862', '#afdf0a', '#a7b61a', '#f3e562', '#ff9800', '#ff5722', '#ff4514'
      ]
    }




  public networkingStats
  public networkingPeersMetrics
  public networkingHistoryDurationSeries

  public onDestroy$ = new Subject()

  constructor(
    public store: Store<any>,
  ) { }

  ngOnInit() {

    // wait for data changes from redux    
    this.store.select('networkingStats')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.networkingStats = data;
      })

    // wait for data changes from redux    
    this.store.select('networkingPeers')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.networkingPeersMetrics = data.metrics;

      })

    // wait for data changes from redux    
    this.store.select('networkingHistory')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.networkingHistoryDurationSeries = [
          ...data.downloadDurationSeries,
          //add actual download rate
          // {
          //   'value': this.networkingStats.downloadRate ? this.networkingStats.downloadRate : '',
          //   'name': (data.downloadDurationSeries.length + 1)
          // }
        ]

        this.single = [
          {
            "name": "History",
            "series": this.networkingHistoryDurationSeries,
          },
          // add empty space to chart and set scale (average value)
          {
            "name": "History",
            "series": [
              {
                'value':Math.round(data.downloadDurationSeries.reduce((avg, item) => ((avg + item.value) / 2), 0) / 50) * 50,
                'name': this.networkingStats.currentBlockCount ?
                  Math.floor(this.networkingStats.currentBlockCount / 4096) : ''
              },
              // {
              //   'value': 100,
              //   'name': this.networkingStats.currentBlockCount ?
              //     Math.floor(this.networkingStats.currentBlockCount / 4096) : '' 
              // }

            ]
          }
        ];

      })
  }

}
