import { Injectable, Provider } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const TRACKING_URLS: string[] = [
  '/dev/shell/automaton/actions',
  '/dev/shell/automaton/mempool/operation_stats',
  '/dev/shell/automaton/storage/requests',
  '/dev/shell/automaton/stats/current_head/application',
  '/dev/shell/automaton/endorsements_status',
  '/dev/shell/automaton/baking_state',
];

@Injectable({
  providedIn: 'root'
})
export class CustomJsonParserInterceptor implements HttpInterceptor {

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return httpRequest.responseType === 'json' && TRACKING_URLS.some(url => httpRequest.url.includes(url))
      ? this.handleJsonResponses(httpRequest, next)
      : next.handle(httpRequest);
  }

  private handleJsonResponses(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(httpRequest.clone({ responseType: 'text' }))
      .pipe(map(event => this.parseResponse(event)));
  }

  private parseResponse(event: HttpEvent<any>): HttpEvent<any> {
    return event instanceof HttpResponse
      ? event.clone({ body: this.getParsedBody(event) })
      : event;
  }

  private getParsedBody(event: HttpResponse<any>): any {
    const bodyWithEscapedLargeNumbers = event.body.replace(/(: |:)(\d{17}|\d{18}|\d{19})([,\}\]])/g, '$1"$2"$3');
    return JSON.parse(bodyWithEscapedLargeNumbers);
  }
}

export const CUSTOM_JSON_PARSER_INTERCEPTOR: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: CustomJsonParserInterceptor,
  multi: true
};
