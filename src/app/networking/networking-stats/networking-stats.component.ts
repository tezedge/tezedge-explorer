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
      "name": "Germany",
      "series": [
        {
          "name": "2010",
          "value": 7300000
        },
        {
          "name": "2011",
          "value": 8940000
        },
        {
          "name": "2012",
          "value": 2940000
        },
        {
          "name": "2013",
          "value": 5940000
        },
        {
          "name": "2014",
          "value": 2940000
        }
      ]
    }
  ];

  // view: any[] = [700, 150];

  // options
  showXAxis = false;
  showYAxis = false;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'Bandwidth';
  showYAxisLabel = false;
  yAxisLabel = 'Time';
  curve = shape.curveBasis; // shape.curveLinear;

  colorScheme = {
    domain: ['#000000', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  public networkingStats
  public networkingPeersMetrics

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
  }

}
