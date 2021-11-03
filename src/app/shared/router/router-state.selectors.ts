import { createFeatureSelector, createSelector } from '@ngrx/store';
import { routerStateConfig } from '@shared/router/ngrx-router.module';
import { MergedRoute, MergedRouteReducerState } from '@shared/router/merged-route';

export const getRouterReducerState = createFeatureSelector<MergedRouteReducerState>(routerStateConfig.stateKey);
export const getMergedRoute = createSelector(getRouterReducerState, (routerReducerState: MergedRouteReducerState): MergedRoute => routerReducerState.state);
