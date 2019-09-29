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
      'series': [
        {
          'value': 6182,
          'name': '2016-09-22T13:44:43.081Z'
        },
        {
          'value': 4938,
          'name': '2016-09-23T00:29:51.341Z'
        },
        {
          'value': 5137,
          'name': '2016-09-17T02:59:36.606Z'
        },
        {
          'value': 2841,
          'name': '2016-09-21T11:01:36.508Z'
        },
        {
          'value': 6347,
          'name': '2016-09-19T21:28:14.801Z'
        },
      ],
    },
    // A null value would have occurred here
    {
      'name': 'Saint Pierre and Miquelon',
      'series': [
        {
          'value': '',
          'name': '2016-10-19T11:28:14.801Z'
        }
      ]
    }
  ];

  // view: any[] = [700, 150];

  // options
  showXAxis = false;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'Bandwidth';
  showYAxisLabel = false;
  yAxisLabel = 'Time';
  curve = shape.curveBasis // shape.curveLinear;
  // curve = shape.curveLinear;

  colorScheme = {
    domain: ['#000000', '#A10A28', '#C7B42C', '#AAAAAA']
  };

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
                'value': Math.round(data.downloadDurationSeries.reduce((avg, item) => ((avg + item.value) / 2), 0) / 50) * 50,
                'name': this.networkingStats.currentBlockCount ?
                  Math.floor(this.networkingStats.currentBlockCount / 4096) : ''
              }
            ]
          }
        ];

      })
  }

}
