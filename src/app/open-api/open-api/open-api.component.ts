import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SettingsNodeApi } from '@shared/types/settings-node/settings-node-api.type';
import { selectActiveNode } from '@settings/settings-node.reducer';
import { ScriptLoaderService } from '@app/core/script-loader.service';

@UntilDestroy()
@Component({
  selector: 'app-open-api',
  templateUrl: './open-api.component.html',
  styleUrls: ['./open-api.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenApiComponent implements OnInit {

  readonly tabs = new Set(['node', 'memory profiler', 'network recorder']);

  swaggerLoaded: boolean;

  constructor(private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private scriptLoaderService: ScriptLoaderService) { }

  ngOnInit(): void {
    this.waitSwaggerToLoad();
    this.getActiveNode();
  }

  private waitSwaggerToLoad(): void {
    this.scriptLoaderService.swaggerLoad.then(() => {
      this.swaggerLoaded = true;
      this.cdRef.detectChanges();
    });
  }

  private getActiveNode(): void {
    this.store.select(selectActiveNode)
      .pipe(untilDestroyed(this))
      .subscribe((node: SettingsNodeApi) => {
        const showMemoryFeature = node.features.find(f => f.memoryProfilerUrl);
        if (showMemoryFeature) {
          this.tabs.add('memory profiler');
        } else {
          this.tabs.delete('memory profiler');
        }
        const showNetworkRecorderFeature = node.features.find(f => f.name === 'debugger');
        if (showNetworkRecorderFeature) {
          this.tabs.add('network recorder');
        } else {
          this.tabs.delete('network recorder');
        }
        this.cdRef.detectChanges();
      });
  }
}
