import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { selectActiveNode } from '../../settings/settings-node/settings-node.reducer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SettingsNodeApi } from '../../shared/types/settings-node/settings-node-api.type';

@UntilDestroy()
@Component({
  selector: 'app-open-api',
  templateUrl: './open-api.component.html',
  styleUrls: ['./open-api.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenApiComponent implements OnInit {

  readonly tabs = new Set(['node', 'memory profiler', 'network recorder']);

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getActiveNode();
  }

  private getActiveNode(): void {
    this.store.select(selectActiveNode)
      .pipe(untilDestroyed(this))
      .subscribe((node: SettingsNodeApi) => {
        const memoryFeature = node.features.find(f => f.name === 'resources/memory');
        if (memoryFeature) {
          this.tabs.add('memory profiler');
        } else {
          this.tabs.delete('memory profiler');
        }
        this.cdRef.detectChanges();
      });
  }
}
