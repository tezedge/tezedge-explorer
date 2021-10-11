import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingSpinnerService {

  private readonly loadingMap: Map<string, boolean> = new Map<string, boolean>();

  readonly loadingSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  setLoading(loading: boolean, url: string): void {
    if (loading) {
      this.loadingMap.set(url, loading);
      this.loadingSub.next(true);
    } else if (!loading && this.loadingMap.has(url)) {
      this.loadingMap.delete(url);

      if (this.loadingMap.size === 0) {
        this.loadingSub.next(false);
      }
    }
  }
}
