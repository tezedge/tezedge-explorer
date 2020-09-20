import { enableProdMode, ApplicationRef } from '@angular/core';
import { enableDebugTools } from '@angular/platform-browser';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


if (environment.production) {
  enableProdMode();

  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));

} else {

  platformBrowserDynamic().bootstrapModule(AppModule)
    // debugg with ng.profiler.timeChangeDetection();
    .then(moduleRef => {
      const applicationRef = moduleRef.injector.get(ApplicationRef);
      const componentRef = applicationRef.components[0];
      enableDebugTools(componentRef);
    })
    .catch(err => console.error(err));
}
