import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { curveLinear } from 'd3-shape';
import { SystemResourcesSubcategory } from '@shared/types/resources/system/system-resources-subcategory.type';
import { SystemResourcesFormattingType } from '@shared/types/resources/system/system-resource-category.type';
import { SystemResourcesResourceType } from '@shared/types/resources/system/system-resources-panel.type';

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
  @Input() active: boolean;
  @Input() graphTitle: string;
  @Input() resourceType: SystemResourcesResourceType;
  @Input() rotatedLabel: string;
  @Input() yAxisTickFormatting: (value: any) => string;
  @Input() xTicksValues: string[];
  @Input() colorScheme: { domain: string[] };
  @Input() curve: any = curveLinear;
  @Input() formattingType: SystemResourcesFormattingType = '';

}
