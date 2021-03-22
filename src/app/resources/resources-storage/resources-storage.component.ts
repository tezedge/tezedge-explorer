import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { StorageResourcesActionTypes } from './resources-storage.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StorageResourcesStats } from '../../shared/types/resources/storage/storage-resources-stats.type';
import { Observable } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-resources-storage',
  templateUrl: './resources-storage.component.html',
  styleUrls: ['./resources-storage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesStorageComponent implements OnInit {

  storageStats$: Observable<StorageResourcesStats>;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {

    this.storageStats$ = this.store.pipe(
      untilDestroyed(this),
      select(state => state.resources.storageResources),
    );

    this.store.dispatch({ type: StorageResourcesActionTypes.LoadResources });
  }

}