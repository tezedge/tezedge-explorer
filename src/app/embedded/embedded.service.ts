import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmbeddedPage } from '@shared/types/embedded/embedded-page.type';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EmbeddedService {

  constructor(private http: HttpClient,
              private datePipe: DatePipe) { }

  getBakingState(http: string): Observable<EmbeddedPage> {
    return this.http.get<EmbeddedPage>(http + '/dev/shell/automaton/baking_state').pipe(
      map(response => this.mapBakingStateResponse(response))
    );
  }

  private mapBakingStateResponse(response: EmbeddedPage): EmbeddedPage {
    const replaceTimes = <T = any>(obj: T): T => {
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          if (key === 'time' || key === 'timeout') {
            obj[key] = this.datePipe.transform(obj[key] / 1000000, 'MM/dd, HH:mm:ss.SSS');
          } else {
            obj[key] = replaceTimes(obj[key]);
          }
        });
      }
      return obj;
    };

    return replaceTimes(response);
  }
}

