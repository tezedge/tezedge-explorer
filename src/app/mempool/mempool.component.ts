import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-mempool',
  templateUrl: './mempool.component.html',
  styleUrls: ['./mempool.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolComponent {

  readonly tabs = [
    { name: 'endorsements', link: 'endorsements' },
    // { name: 'broadcast', link: 'broadcast' },
    { name: 'pending', link: 'operations' },
    { name: 'statistics', link: 'statistics' },
  ];

}
