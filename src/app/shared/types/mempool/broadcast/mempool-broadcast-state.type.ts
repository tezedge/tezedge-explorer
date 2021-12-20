import { MempoolOperation } from '@shared/types/mempool/operation/mempool-operation.type';

export interface MempoolBroadcastState {
  mempoolOperations: MempoolOperation[];
}
