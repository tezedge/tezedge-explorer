import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { curveCardinal } from 'd3-shape';
import { ResourcesSummaryBlock, ResourceType, SeriesEntry } from '../system-resources/system-resources.component';

@Component({
  selector: 'app-system-resources-graph',
  templateUrl: './system-resources-graph.component.html',
  styleUrls: ['./system-resources-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemResourcesGraphComponent {

  @Input() chartData: Array<{ name: string; series: Array<SeriesEntry>; }>;
  @Input() transitionDelay: number;
  @Input() labelList: ResourcesSummaryBlock[];
  @Input() graphTitle: string;
  @Input() resourceType: ResourceType;
  @Input() rotatedLabel: string;
  @Input() yAxisTickFormatting: (value: any) => string;
  @Input() xTicksValues: string[];
  @Input() colorScheme: { domain: string[] };
  @Input() curve: any = curveCardinal;
  @Input() formattingType: 'percentage' | 'GB' | 'MB' = 'GB';

  @Output() graphHover = new EventEmitter<ResourceType>();

  toggleActiveSummary(): void {
    this.graphHover.emit(this.resourceType);
  }
}
