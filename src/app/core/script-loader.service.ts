import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {

  swaggerLoad: Promise<void>;

  private renderer: Renderer2;

  constructor(@Inject(DOCUMENT) private document: Document,
              rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  loadScripts(): void {
    const injectionPromises = [
      new Promise<void>((resolve) => {
        const script = this.renderer.createElement('script');
        script.src = 'swagger-ui.js';
        script.onload = () => resolve();
        this.renderer.appendChild(this.document.body, script);
      }),
      new Promise<void>((resolve) => {
        const style = this.renderer.createElement('link');
        style.href = 'swagger-ui.css';
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.onload = () => resolve();
        this.renderer.appendChild(this.document.head, style);
      })
    ];

    this.swaggerLoad = new Promise<void>((resolve) => {
      Promise.all(injectionPromises).then(() => resolve());
    });
  }
}
