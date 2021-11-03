import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-mempool-broadcast',
  templateUrl: './mempool-broadcast.component.html',
  styleUrls: ['./mempool-broadcast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MempoolBroadcastComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
