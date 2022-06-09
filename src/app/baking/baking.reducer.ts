import { BakingState } from '@baking/baking.index';
import {
  BAKING_ADD_DISTRIBUTED_REWARD,
  BAKING_APPLY_COMMISSION_FEE,
  BAKING_APPLY_TRANSACTION_FEE,
  BAKING_GET_BAKERS_SUCCESS,
  BAKING_GET_CYCLE_SUCCESS,
  BAKING_GET_DELEGATORS_SUCCESS,
  BAKING_LEDGER_CONNECTED,
  BAKING_SET_ACTIVE_BAKER,
  BAKING_SORT_DELEGATES,
  BAKING_SORT_DELEGATORS,
  BAKING_STOP,
  BAKING_UPDATE_TRANSACTION_STATUSES,
  BakingActions
} from '@baking/baking.actions';
import { BakingDelegator } from '@shared/types/bakings/baking-delegator.type';
import { BakingBatch } from '@shared/types/bakings/baking-batch.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { BakingBaker } from '@shared/types/bakings/baking-baker.type';
import { BakingPaymentStatus } from '@shared/types/bakings/baking-payment-status.type';

const initialState: BakingState = {
  cycle: 0,
  bakers: [],
  ledger: null,
  activeBaker: null,
  activeBakerHash: null,
  delegators: [],
  sortedDelegators: [],
  commissionFee: 0,
  transactionFee: 0.01,
  sort: {
    sortBy: 'delegatorsLength',
    sortDirection: SortDirection.DSC
  }
};

const BATCH_SIZE: number = 80;

export function reducer(state: BakingState = initialState, action: BakingActions): BakingState {

  switch (action.type) {

    case BAKING_GET_CYCLE_SUCCESS: {
      return {
        ...state,
        cycle: action.payload.cycle,
      };
    }

    case BAKING_GET_BAKERS_SUCCESS: {
      const activeBaker = action.payload.bakers.find(b => b.hash === state.activeBakerHash);

      return {
        ...state,
        bakers: sortDelegatesOrDelegators(action.payload.bakers, state.sort),
        activeBaker: !activeBaker ? null : {
          ...activeBaker,
          batches: []
        }
      };
    }

    case BAKING_GET_DELEGATORS_SUCCESS: {
      const { batches, delegators } = getBatchesAndDelegators([...action.payload]);
      const rewardToDistribute = batches.reduce((sum, curr) => sum + curr.reward, 0);
      if (!state.activeBakerHash) {
        return {
          ...state
        };
      }
      return {
        ...state,
        delegators,
        sortedDelegators: sortDelegatesOrDelegators(delegators, state.sort),
        activeBaker: {
          ...state.activeBaker,
          rewardToDistribute,
          rewardAfterFee: rewardToDistribute,
          batches,
        }
      };
    }

    case BAKING_LEDGER_CONNECTED: {
      return {
        ...state,
        ledger: action.payload.ledger,
      };
    }

    case BAKING_SET_ACTIVE_BAKER: {
      const activeBaker = state.bakers.find(b => b.hash === action.payload.hash);

      let sort = state.sort;
      if (activeBaker && ['delegatorsLength', 'bakerName'].includes(sort.sortBy)) {
        sort = { ...sort, sortBy: 'balance' };
      } else if (!activeBaker) {
        sort = { sortDirection: SortDirection.DSC, sortBy: 'delegatorsLength' };
      }

      return {
        ...state,
        sort,
        delegators: [],
        sortedDelegators: [],
        ledger: state.ledger?.publicKeyHash === activeBaker?.hash ? state.ledger : null,
        activeBakerHash: action.payload.hash,
        activeBaker: !activeBaker ? null : {
          ...activeBaker,
          batches: []
        }
      };
    }

    case BAKING_ADD_DISTRIBUTED_REWARD: {
      const newBatch = action.payload.batch;
      const delegators = [
        ...state.delegators.slice(0, newBatch.index),
        ...state.delegators.slice(newBatch.index, newBatch.index + newBatch.transactions).map(d => ({
          ...d,
          status: newBatch.status
        })),
        ...state.delegators.slice(newBatch.index + newBatch.transactions),
      ];
      return {
        ...state,
        delegators,
        sortedDelegators: sortDelegatesOrDelegators(delegators, state.sort),
        activeBaker: {
          ...state.activeBaker,
          batches: state.activeBaker.batches.map(b => {
            if (b.index === newBatch.index) {
              return newBatch;
            }
            return b;
          }),
        }
      };
    }

    case BAKING_SORT_DELEGATES: {
      return {
        ...state,
        sort: { ...action.payload },
        bakers: sortDelegatesOrDelegators(state.bakers, action.payload)
      };
    }

    case BAKING_SORT_DELEGATORS: {
      return {
        ...state,
        sort: { ...action.payload },
        sortedDelegators: sortDelegatesOrDelegators(state.delegators, action.payload)
      };
    }

    case BAKING_UPDATE_TRANSACTION_STATUSES: {
      const updates = action.payload;
      let delegators: BakingDelegator[];
      let sortedDelegators = state.sortedDelegators;
      if (!updates.some(up => up.source === state.activeBaker.hash)) {
        delegators = state.delegators;
      } else {
        delegators = state.delegators.map(delegator => {
          const index = updates.findIndex(up => up.destination === delegator.hash);
          if (index !== -1) {
            return {
              ...delegator,
              status: updates[index].status === 'applied'
                ? BakingPaymentStatus.APPLIED
                : updates[index].status === 'pending'
                  ? BakingPaymentStatus.PENDING
                  : BakingPaymentStatus.UNPAID
            };
          }
          return delegator;
        });
        sortedDelegators = sortDelegatesOrDelegators(delegators, state.sort);
      }
      return {
        ...state,
        delegators,
        sortedDelegators,
        activeBaker: {
          ...state.activeBaker,
          batches: state.activeBaker.batches.map(batch => {
            const batchDelegators = delegators.slice(batch.index, batch.index + batch.transactions);
            return {
              ...batch,
              operationHash: updates.find(up => up.destination === batchDelegators[0].hash && up.source === state.activeBaker.hash)?.operation || batch.operationHash,
              status: getBatchStatus(batchDelegators)
            };
          })
        }
      };
    }

    case BAKING_APPLY_COMMISSION_FEE: {
      const feePercentage = action.payload / 100;
      const delegators = state.delegators.map(delegator => {
        const rewardAfterFee = delegator.reward - (delegator.reward * feePercentage);
        return ({
          ...delegator,
          rewardAfterFee,
          fee: delegator.reward - rewardAfterFee
        });
      });
      const batches = state.activeBaker.batches.map(batch => ({
        ...batch,
        rewardAfterFee: batch.reward - (batch.reward * feePercentage)
      }));

      return {
        ...state,
        commissionFee: action.payload,
        delegators,
        sortedDelegators: sortDelegatesOrDelegators(delegators, state.sort),
        activeBaker: {
          ...state.activeBaker,
          rewardAfterFee: state.activeBaker.rewardToDistribute - state.activeBaker.rewardToDistribute * feePercentage,
          batches,
        }
      };
    }

    case BAKING_APPLY_TRANSACTION_FEE: {
      return {
        ...state,
        transactionFee: action.payload
      };
    }

    case BAKING_STOP: {
      return initialState;
    }

    default:
      return state;
  }
}

function getBatchesAndDelegators(delegators: BakingDelegator[]): { batches: BakingBatch[], delegators: BakingDelegator[] } {
  const batches = getBatches(delegators);
  batches.forEach((batch: BakingBatch, batchCount: number) => {
    delegators = [
      ...delegators.slice(0, batch.index),
      ...delegators.slice(batch.index, batch.index + batch.transactions).map(d => ({
        ...d,
        batch: batchCount
      })),
      ...delegators.slice(batch.index + batch.transactions),
    ];
  });
  return { batches, delegators };
}

function getBatchStatus(batchDelegators: BakingDelegator[]): BakingPaymentStatus {
  const allAreApplied = batchDelegators.every(delegator => delegator.status === BakingPaymentStatus.APPLIED);
  if (allAreApplied) {
    return BakingPaymentStatus.APPLIED;
  } else if (!allAreApplied && batchDelegators.every(delegator => delegator.status === BakingPaymentStatus.PENDING)) {
    return BakingPaymentStatus.PENDING;
  } else {
    return BakingPaymentStatus.UNPAID;
  }
}

function getBatches(delegators: BakingDelegator[]): BakingBatch[] {
  if (!delegators) {
    return [];
  }
  let i = 0;
  const batches: BakingBatch[] = [];
  while (delegators.length > i) {
    const reward = delegators.slice(i, i + BATCH_SIZE).reduce((sum: number, curr: BakingDelegator) => sum + curr.reward, 0);
    const batch: BakingBatch = {
      index: batches.length * BATCH_SIZE,
      transactions: (delegators.length > i + BATCH_SIZE) ? BATCH_SIZE : (delegators.length - i),
      reward,
      rewardAfterFee: reward,
      status: undefined
    };
    i += BATCH_SIZE;
    batches.push(batch);
  }
  return batches;
}

function sortDelegatesOrDelegators<T = BakingDelegator | BakingBaker>(array: T[], sort: TableSort): T[] {
  if (!array) {
    return [];
  }
  const sortProperty = sort.sortBy;

  const sortFunction = (e1: T, e2: T): number => {
    if (['hash', 'bakerName'].includes(sortProperty)) {
      return sort.sortDirection === SortDirection.DSC
        ? e2[sortProperty].localeCompare(e1[sortProperty])
        : e1[sortProperty].localeCompare(e2[sortProperty]);
    }
    return sort.sortDirection === SortDirection.DSC
      ? (e2[sortProperty] - e1[sortProperty])
      : (e1[sortProperty] - e2[sortProperty]);
  };
  return [...array].sort(sortFunction);
}
