import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProgressBarService } from './progress-bar.service';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarInterceptor implements HttpInterceptor {

  lastValue = 0;

  constructor(private progressBarService: ProgressBarService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.reportProgress) {
      return next.handle(req).pipe(
        tap((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.DownloadProgress) {
            const value = Math.round(event.loaded / event.total * 100);

            for (let i = this.lastValue; i < value; i += 5) {
              this.progressBarService.updateGlobalProgress(i);
            }

            this.lastValue = value;

            this.progressBarService.updateGlobalProgress(value);
          } else if (event.type === HttpEventType.Response) {
            this.progressBarService.updateGlobalProgress(0);
          }
        }, () => this.progressBarService.updateGlobalProgress(0))
      );
    } else {
      return next.handle(req);
    }
  }
}
