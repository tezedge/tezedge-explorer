import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { LoadingSpinnerService } from '@shared/loading-spinner/loading-spinner.service';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingSpinnerInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingSpinnerService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.setLoading(true, request.url);
    return next.handle(request)
      .pipe(
        finalize(() => this.loadingService.setLoading(false, request.url))
      );
  }
}
