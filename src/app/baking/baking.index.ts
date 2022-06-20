import { BakingPage } from '@shared/types/baking/baking-page.type';
import { State } from '@app/app.index';

export interface BakingState {
  pages: BakingPage[];
  activePageIndex: number;
  stream: boolean;
}

export const selectBakingState = (state: State): BakingState => state.baking;
export const selectBakingStateActivePage = (state: State): BakingPage => state.baking.pages[state.baking.activePageIndex];
