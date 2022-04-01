import { createEffect } from '@ngrx/effects';

export const createNonDispatchableEffect = (source: () => any) => createEffect(source, { dispatch: false });
