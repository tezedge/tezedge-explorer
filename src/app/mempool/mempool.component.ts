import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mempool',
  templateUrl: './mempool.component.html',
  styleUrls: ['./mempool.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolComponent implements OnInit {

  readonly tabs = [
    {
      name: 'endorsement rights',
      link: 'endorsements'
    }, {
      name: 'operations',
      link: 'operations'
    },
  ];

  constructor() {}

  ngOnInit(): void {
  }

}
