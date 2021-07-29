import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { systemResourcesDetails } from '../resources/resources.reducer';
import { SystemResourcesPanel } from '../../shared/types/resources/system/system-resources-panel.type';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-system-resources-panel',
  templateUrl: './system-resources-panel.component.html',
  styleUrls: ['./system-resources-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemResourcesPanelComponent implements OnInit {

  @Input() colors: string[];

  resource$: Observable<SystemResourcesPanel>;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.resource$ = this.store.select(systemResourcesDetails);
  }
}
