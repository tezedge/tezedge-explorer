import { APP_INITIALIZER, Injectable, Injector, Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JsonLoaderService {

  private bakersDetails = {};

  constructor(private injector: Injector) { }

  get bakers(): object {
    return this.bakersDetails;
  }

  async getBakerNames() {
    const http = this.injector.get(HttpClient);
    await http.get('assets/json/mempool-bakers.json').subscribe(bakers => {
      this.bakersDetails = bakers;
    });
  }
}

function loadJsons(jsonLoaderService: JsonLoaderService): Function {
  return () => jsonLoaderService.getBakerNames();
}

export const JSON_LOADER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: loadJsons,
  deps: [JsonLoaderService],
  multi: true
};
