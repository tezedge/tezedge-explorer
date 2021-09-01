import { SettingsNodeApi } from '@shared/types/settings-node/settings-node-api.type';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { Directive, ElementRef, OnInit } from '@angular/core';
import { selectActiveNode } from '@settings/settings-node.reducer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

declare const SwaggerUIBundle: any;

@UntilDestroy()
@Directive()
export abstract class BaseOpenApiComponent implements OnInit {

  protected activeNode: SettingsNodeApi;
  protected abstract URL: string;
  protected abstract insertionPoint: ElementRef<HTMLDivElement>;

  protected constructor(private http: HttpClient,
                        private store: Store<State>) { }

  ngOnInit(): void {
    this.listenToActiveNode();
    this.buildUrl();
    this.initOpenAPI();
  }

  protected abstract buildUrl(): void;

  private listenToActiveNode(): void {
    this.store.select(selectActiveNode)
      .pipe(untilDestroyed(this))
      .subscribe((node: SettingsNodeApi) => this.activeNode = node);
  }

  private initOpenAPI(): void {
    SwaggerUIBundle({
      dom_id: '#' + this.insertionPoint.nativeElement.id,
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      url: this.URL,
      docExpansion: 'none',
      operationsSorter: 'alpha'
    });
  }
}
