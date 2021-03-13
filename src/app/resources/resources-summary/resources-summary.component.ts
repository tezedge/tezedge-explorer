import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ResourcesSummaryBlock, ResourceType } from '../resources/resources.component';

@Component({
  selector: 'app-resources-summary',
  templateUrl: './resources-summary.component.html',
  styleUrls: ['./resources-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesSummaryComponent {

  @Input() summaryBlocks: ResourcesSummaryBlock[];
  @Input() resourceType: ResourceType;

}
