import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { selectActiveNode } from '@settings/settings-node.reducer';
import { filter, map } from 'rxjs/operators';
import { SettingsNodeApi } from '@shared/types/settings-node/settings-node-api.type';

@Injectable({
  providedIn: 'root'
})
export class NetworkGuard implements CanActivate {

  constructor(private store: Store<State>,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(selectActiveNode).pipe(
      filter(Boolean),
      map((node: SettingsNodeApi) => {
        if (node.features.some(f => f.name === 'network')) {
          return true;
        } else {
          this.router.navigateByUrl('');
          return false;
        }
      })
    );
  }
}
