import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { State } from '../../app.reducers';
import { StorageResourcesActionTypes } from '../storage-resources/storage-resources.actions';
import { MemoryResourcesActionTypes, MemoryResourcesLoad, MemoryResourcesLoaded } from '../memory-resources/memory-resources.actions';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { selectFeatures } from '../../settings/settings-node/settings-node.reducer';
import { Observable } from 'rxjs';

const AVAILABLE_TABS = [
  { title: 'System overview', link: 'system' },
  { title: 'Storage', link: 'storage' },
  { title: 'Memory', link: 'memory' }
];

@UntilDestroy()
@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesComponent implements OnInit {

  tabs$: Observable<any>;
  reversedCheckboxState = false;
  activeRoute: string;

  constructor(private store: Store<State>,
              private router: Router,
              private route: ActivatedRoute,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listenToNodeChange();
    this.listenToRouteChange();
  }

  private listenToNodeChange(): void {
    this.tabs$ = this.store.pipe(
      untilDestroyed(this),
      select(selectFeatures),
      map(features => features.map(f => f.name).filter(name => name.includes('resources'))),
      map(resourceFeatureNames => (
        AVAILABLE_TABS.filter(tab => resourceFeatureNames.some(name => name.includes(tab.link)))
      ))
    );
  }

  private listenToRouteChange(): void {
    this.activeRoute = this.router.url.split('/').pop();
    this.router.events
      .pipe(untilDestroyed(this), filter(ev => ev instanceof NavigationEnd))
      .subscribe((ev: NavigationEnd) => this.activeRoute = ev.urlAfterRedirects.split('/').pop());
  }

  onTabChange(): void {
    this.reversedCheckboxState = false;
  }

  onReversedCheckboxChange(event: MatCheckboxChange): void {
    this.reversedCheckboxState = event.checked;
    this.cdRef.detectChanges();
    this.store.dispatch<MemoryResourcesLoad>({
      type: MemoryResourcesActionTypes.MEMORY_RESOURCES_LOAD,
      payload: { reversed: this.reversedCheckboxState }
    });
  }
}
