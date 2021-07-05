import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../app.reducers';
import { selectActiveNode } from '../settings/settings-node/settings-node.reducer';
import { map } from 'rxjs/operators';
import { SettingsNodeApi } from '../shared/types/settings-node/settings-node-api.type';

@Injectable({
  providedIn: 'root'
})
export class ResourcesGuard implements CanActivate {

  constructor(private store: Store<State>) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(selectActiveNode).pipe(
      map((node: SettingsNodeApi) => node.features.some(f => f.name.includes(route.url[0].path)))
    );
  }

}
