import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-open-api',
  templateUrl: './open-api.component.html',
  styleUrls: ['./open-api.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenApiComponent {

  readonly tabs = ['node', 'memory profiler', 'network recorder'];
}
