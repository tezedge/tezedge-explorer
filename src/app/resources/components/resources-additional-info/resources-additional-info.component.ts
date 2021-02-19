import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ResourcesAdditionalInfoBlock } from '../resources/resources.component';

@Component({
  selector: 'app-resources-additional-info',
  templateUrl: './resources-additional-info.component.html',
  styleUrls: ['./resources-additional-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesAdditionalInfoComponent {

  @Input() additionalInfo: ResourcesAdditionalInfoBlock[];

}
