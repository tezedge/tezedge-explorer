import { TypedAction } from '@ngrx/store/src/models';

export type FeatureAction<T extends string> = TypedAction<T>;
