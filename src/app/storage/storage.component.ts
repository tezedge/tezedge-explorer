import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageComponent {

  readonly tabs = ['blocks', 'requests'];

}
