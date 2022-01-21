import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-mempool',
  templateUrl: './mempool.component.html',
  styleUrls: ['./mempool.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolComponent {

  readonly tabs = [
    { name: 'block application', link: 'block-application' },
    { name: 'endorsements', link: 'endorsements' },
    { name: 'pending', link: 'operations' },
    { name: 'statistics', link: 'statistics' },
  ];

}
