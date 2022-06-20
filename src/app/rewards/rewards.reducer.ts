import { RewardsState } from '@rewards/rewards.index';
import {
  REWARDS_ADD_DISTRIBUTED_REWARD,
  REWARDS_APPLY_COMMISSION_FEE,
  REWARDS_APPLY_TRANSACTION_FEE,
  REWARDS_GET_BAKERS_SUCCESS,
  REWARDS_GET_CYCLE_SUCCESS,
  REWARDS_GET_DELEGATORS_SUCCESS,
  REWARDS_LEDGER_CONNECTED,
  REWARDS_SET_ACTIVE_BAKER,
  REWARDS_SORT_DELEGATES,
  REWARDS_SORT_DELEGATORS,
  REWARDS_STOP,
  REWARDS_UPDATE_TRANSACTION_STATUSES,
  RewardsActions
} from '@rewards/rewards.actions';
import { RewardsDelegator } from '@shared/types/rewards/rewards-delegator.type';
import { RewardsBatch } from '@shared/types/rewards/rewards-batch.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { RewardsBaker } from '@shared/types/rewards/rewards-baker.type';
import { RewardsPaymentStatus } from '@shared/types/rewards/rewards-payment-status.type';

const initialState: RewardsState = {
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

export function reducer(state: RewardsState = initialState, action: RewardsActions): RewardsState {

  switch (action.type) {

    case REWARDS_GET_CYCLE_SUCCESS: {
      return {
        ...state,
        cycle: action.payload.cycle,
      };
    }

    case REWARDS_GET_BAKERS_SUCCESS: {
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

    case REWARDS_GET_DELEGATORS_SUCCESS: {
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

    case REWARDS_LEDGER_CONNECTED: {
      return {
        ...state,
        ledger: action.payload.ledger,
      };
    }

    case REWARDS_SET_ACTIVE_BAKER: {
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

    case REWARDS_ADD_DISTRIBUTED_REWARD: {
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

    case REWARDS_SORT_DELEGATES: {
      return {
        ...state,
        sort: { ...action.payload },
        bakers: sortDelegatesOrDelegators(state.bakers, action.payload)
      };
    }

    case REWARDS_SORT_DELEGATORS: {
      return {
        ...state,
        sort: { ...action.payload },
        sortedDelegators: sortDelegatesOrDelegators(state.delegators, action.payload)
      };
    }

    case REWARDS_UPDATE_TRANSACTION_STATUSES: {
      const updates = action.payload;
      let delegators: RewardsDelegator[];
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
                ? RewardsPaymentStatus.APPLIED
                : updates[index].status === 'pending'
                  ? RewardsPaymentStatus.PENDING
                  : RewardsPaymentStatus.UNPAID
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

    case REWARDS_APPLY_COMMISSION_FEE: {
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

    case REWARDS_APPLY_TRANSACTION_FEE: {
      return {
        ...state,
        transactionFee: action.payload
      };
    }

    case REWARDS_STOP: {
      return initialState;
    }

    default:
      return state;
  }
}

function getBatchesAndDelegators(delegators: RewardsDelegator[]): { batches: RewardsBatch[], delegators: RewardsDelegator[] } {
  const batches = getBatches(delegators);
  batches.forEach((batch: RewardsBatch, batchCount: number) => {
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

function getBatchStatus(batchDelegators: RewardsDelegator[]): RewardsPaymentStatus {
  const allAreApplied = batchDelegators.every(delegator => delegator.status === RewardsPaymentStatus.APPLIED);
  if (allAreApplied) {
    return RewardsPaymentStatus.APPLIED;
  } else if (!allAreApplied && batchDelegators.every(delegator => delegator.status === RewardsPaymentStatus.PENDING)) {
    return RewardsPaymentStatus.PENDING;
  } else {
    return RewardsPaymentStatus.UNPAID;
  }
}

function getBatches(delegators: RewardsDelegator[]): RewardsBatch[] {
  if (!delegators) {
    return [];
  }
  let i = 0;
  const batches: RewardsBatch[] = [];
  while (delegators.length > i) {
    const reward = delegators.slice(i, i + BATCH_SIZE).reduce((sum: number, curr: RewardsDelegator) => sum + curr.reward, 0);
    const batch: RewardsBatch = {
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

function sortDelegatesOrDelegators<T = RewardsDelegator | RewardsBaker>(array: T[], sort: TableSort): T[] {
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
