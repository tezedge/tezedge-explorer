import { VirtualScrollActivePage } from '@shared/types/shared/virtual-scroll-active-page.type';
import { StateMachineProposal } from '@shared/types/state-machine/state-machine-proposal.type';

export interface StateMachineProposalTable {
  ids: number[];
  entities: { [id: string]: StateMachineProposal };
  activePage: VirtualScrollActivePage;
  pages: number[];
  lastCursorId: number;
  stream: boolean;
}
