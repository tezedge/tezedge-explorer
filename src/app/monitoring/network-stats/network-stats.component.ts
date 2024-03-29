import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';
import { State } from '@app/app.index';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NetworkStats } from '@shared/types/network/network-stats.type';
import { selectNetworkStats } from '@monitoring/monitoring.index';

@UntilDestroy()
@Component({
  selector: 'app-network-stats',
  templateUrl: './network-stats.component.html',
  styleUrls: ['./network-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkStatsComponent implements OnInit {

  networkStats: NetworkStats;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.store.select(selectNetworkStats)
      .pipe(
        debounceTime(200),
        untilDestroyed(this)
      )
      .subscribe((networkStats: NetworkStats) => {
        this.networkStats = networkStats;
        this.cdRef.detectChanges();
      });
  }
}
