import { EmbeddedPage } from '@shared/types/embedded/embedded-page.type';
import { State } from '@app/app.index';

export interface EmbeddedState {
  pages: EmbeddedPage[];
  activePageIndex: number;
  stream: boolean;
}

export const selectEmbeddedState = (state: State): EmbeddedState => state.embedded;
export const selectEmbeddedStateActivePage = (state: State): EmbeddedPage => state.embedded.pages[state.embedded.activePageIndex];
