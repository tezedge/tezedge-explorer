import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { curveCardinal } from 'd3-shape';
import { SystemResourcesSubcategory } from '../../shared/types/resources/system/system-resources-subcategory.type';
import { SystemResourcesFormattingType } from '../../shared/types/resources/system/system-resource-category.type';
import { ResourceType } from '../../shared/types/resources/system/system-resources-panel.type';

@Component({
  selector: 'app-system-resources-graph',
  templateUrl: './system-resources-graph.component.html',
  styleUrls: ['./system-resources-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemResourcesGraphComponent {

  @Input() chartData: SystemResourcesSubcategory[];
  @Input() transitionDelay: number;
  @Input() labelList: string[];
  @Input() graphTitle: string;
  @Input() resourceType: ResourceType;
  @Input() rotatedLabel: string;
  @Input() yAxisTickFormatting: (value: any) => string;
  @Input() xTicksValues: string[];
  @Input() colorScheme: { domain: string[] };
  @Input() curve: any = curveCardinal;
  @Input() formattingType: SystemResourcesFormattingType = '';

}
