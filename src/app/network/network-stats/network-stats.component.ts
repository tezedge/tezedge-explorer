import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import * as shape from 'd3-shape';

@Component({
  selector: 'app-network-stats',
  templateUrl: './network-stats.component.html',
  styleUrls: ['./network-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkStatsComponent implements OnInit {

  single = [
    {
      'name': 'Saint Pierre and Miquelon',
      'series': []
    }
  ];

  // view: any[] = [700, 150];

  // options
  public showXAxis = false;
  public showYAxis = false;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = false;
  public xAxisLabel = 'Bandwidth';
  public showYAxisLabel = false;
  public yAxisLabel = 'Time';
  public curve = shape.curveBasis; // shape.curveLinear;
  // public curve = shape.curveLinear;

  public colorScheme =
    {
      name: 'vivid',
      selectable: true,
      group: 'Ordinal',
      domain: [
        '#000000', '#3f51b5', '#2196f3', '#00b862', '#afdf0a', '#a7b61a', '#f3e562', '#ff9800', '#ff5722', '#ff4514'
      ]
    };


  public networkStats;
  public networkPeersMetrics;
  public networkHistoryDurationSeries;

  public onDestroy$ = new Subject();

  constructor(public store: Store<any>,
              private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {

    // wait for data changes from redux
    this.store.select('networkStats')
      .pipe(
        debounceTime(200),
        takeUntil(this.onDestroy$)
      )
      .subscribe(data => {
        this.networkStats = data;
        this.cdRef.detectChanges();
      });

    // wait for data changes from redux
    this.store.select('networkPeers')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.networkPeersMetrics = data.metrics;
      });

    // wait for data changes from redux
    this.store.select('networkHistory')
      .pipe(
        debounceTime(200),
        takeUntil(this.onDestroy$)
      )
      .subscribe(data => {
        this.networkHistoryDurationSeries = [
          ...data.downloadDurationSeries,
          //add actual download rate
          // {
          //   'value': this.networkStats.downloadRate ? this.networkStats.downloadRate : '',
          //   'name': (data.downloadDurationSeries.length + 1)
          // }
        ];

        this.single = [
          {
            'name': 'History',
            'series': this.networkHistoryDurationSeries,
          },
          // add empty space to chart and set scale (average value)
          {
            'name': 'History',
            'series': [
              {
                'value': Math.round(data.downloadDurationSeries.reduce((avg, item) => ((avg + item.value) / 2), 0) / 50) * 50,
                'name': this.networkStats?.currentBlockCount ?
                  Math.floor(this.networkStats?.currentBlockCount / 4096) : ''
              },
              // {
              //   'value': 100,
              //   'name': this.networkStats.currentBlockCount ?
              //     Math.floor(this.networkStats.currentBlockCount / 4096) : ''
              // }

            ]
          }
        ];

      });
  }


  ngOnDestroy() {

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
