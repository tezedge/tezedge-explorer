import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {

  readonly progress$ = new ReplaySubject<number>(0);

  updateGlobalProgress(value: number): void {
    this.progress$.next(value);
  }
}
