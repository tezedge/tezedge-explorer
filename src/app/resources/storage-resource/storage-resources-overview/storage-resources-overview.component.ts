import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ResourceStorageQuery } from '@shared/types/resources/storage/storage-resource-operation.type';

@Component({
  selector: 'app-storage-resources-overview',
  templateUrl: './storage-resources-overview.component.html',
  styleUrls: ['./storage-resources-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageResourcesOverviewComponent {

  @Input() data: ResourceStorageQuery;
  @Input() sliceNames: string[];

}
