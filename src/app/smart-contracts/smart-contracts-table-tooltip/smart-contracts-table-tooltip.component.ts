import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-smart-contracts-table-tooltip',
  templateUrl: './smart-contracts-table-tooltip.component.html',
  styleUrls: ['./smart-contracts-table-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartContractsTableTooltipComponent {

  @Input() traceGas: number;
  @Input() blockStatus: string;
  @Input() traceStatus: string;
  @Input() isSameStorage: boolean;
  @Input() isSameBigMaps: boolean;

  constructor(public cdRef: ChangeDetectorRef) { }
}
