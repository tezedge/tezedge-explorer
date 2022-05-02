import { Store } from '@ngrx/store';
import { Selector } from '@ngrx/store/src/models';
import { OperatorFunction } from 'rxjs';
import { FeatureAction } from './feature-action.type';
import { selectActionState } from '@shared/constants/store-functions';
import { State } from '@app/app.index';

export abstract class TezedgeBaseEffect<S extends object, A extends FeatureAction<any>> {

  protected readonly latestActionState = <Action extends A>(): OperatorFunction<Action, { action: Action; state: S; }> => selectActionState<S, Action>(this.store, this.selector);

  protected constructor(protected store: Store<S>,
                        private selector: Selector<S, any>) { }

  protected http(state: State): string {
    return state.settingsNode.activeNode.http;
  }
}
