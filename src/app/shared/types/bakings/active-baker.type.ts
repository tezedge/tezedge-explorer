import { BakingBatch } from '@shared/types/bakings/baking-batch.type';
import { BakingBaker } from '@shared/types/bakings/baking-baker.type';

export interface ActiveBaker extends BakingBaker {
  batches: BakingBatch[];
}
