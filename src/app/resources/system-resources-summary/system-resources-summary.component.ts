import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ResourceType } from '../system-resources/system-resources.component';
import { SystemResourcesSummaryBlock } from '../../shared/types/resources/system/system-resources-summary-block.type';

@Component({
  selector: 'app-system-resources-summary',
  templateUrl: './system-resources-summary.component.html',
  styleUrls: ['./system-resources-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemResourcesSummaryComponent {

  @Input() summaryBlocks: SystemResourcesSummaryBlock[];
  @Input() resourceType: ResourceType;
  @Input() time: string;

}
