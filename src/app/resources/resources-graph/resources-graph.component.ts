import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ResourcesSummaryBlock, ResourceType, SeriesEntry } from '../resources/resources.component';
import { curveCardinal } from 'd3-shape';

@Component({
  selector: 'app-resources-graph',
  templateUrl: './resources-graph.component.html',
  styleUrls: ['./resources-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesGraphComponent {

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

  @Output() graphClick = new EventEmitter<ResourceType>();

  toggleActiveSummary(): void {
    this.graphClick.emit(this.resourceType);
  }
}
