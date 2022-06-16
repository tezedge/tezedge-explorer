import { EmbeddedQuorum } from '@shared/types/embedded/embedded-quorum.type';
import { EmbeddedHeadHeader } from '@shared/types/embedded/embedded-head-header.type';

export interface EmbeddedPage {
  current_head: {
    hash: string;
    header: EmbeddedHeadHeader;
  };
  prequorum: EmbeddedQuorum;
  quorum: EmbeddedQuorum;
  bakers: { [hash: string]: any };
}
