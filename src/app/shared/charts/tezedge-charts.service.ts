import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { SystemResourcesResourceType } from '@shared/types/resources/system/system-resources-panel.type';

@Injectable({ providedIn: 'root' })
export class TezedgeChartsService {

  private storeSubject: Subject<{ type: 'recently' | 'runnerGroups', resourceType: SystemResourcesResourceType, timestamp: string }> = new Subject<null>();
  private allowChange: boolean = true;
  private currentValue: any;

  updateSystemResources(payload: { type: 'recently' | 'runnerGroups', resourceType: SystemResourcesResourceType, timestamp: string }): void {
    this.storeSubject.next(payload);
  }

  storeSubject$(): Observable<{ type: 'recently' | 'runnerGroups', resourceType: SystemResourcesResourceType, timestamp: string }> {
    return this.storeSubject.asObservable().pipe(
      debounceTime(150),
      filter(() => this.allowChange),
      tap(value => {
        if (this.currentValue !== value.resourceType) {
          this.currentValue = value.resourceType;
          this.allowChange = false;
          setTimeout(() => this.allowChange = true, 200);
        }
      })
    );
  }
}
