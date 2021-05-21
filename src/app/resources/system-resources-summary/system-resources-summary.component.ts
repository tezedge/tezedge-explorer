import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ResourcesSummaryBlock, ResourceType } from '../system-resources/system-resources.component';

@Component({
  selector: 'app-system-resources-summary',
  templateUrl: './system-resources-summary.component.html',
  styleUrls: ['./system-resources-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemResourcesSummaryComponent {

  @Input() summaryBlocks: ResourcesSummaryBlock[];
  @Input() resourceType: ResourceType;
  @Input() time: string;

}
