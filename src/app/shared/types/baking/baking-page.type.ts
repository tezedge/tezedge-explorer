import { BakingQuorum } from '@shared/types/baking/baking-quorum.type';
import { BakingHeadHeader } from '@shared/types/baking/baking-head-header.type';

export interface BakingPage {
  current_head: {
    hash: string;
    header: BakingHeadHeader;
  };
  prequorum: BakingQuorum;
  quorum: BakingQuorum;
  bakers: { [hash: string]: any };
}
