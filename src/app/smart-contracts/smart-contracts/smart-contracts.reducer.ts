import { SmartContractsState } from '@shared/types/smart-contracts/smart-contracts-state.type';
import {
  SMART_CONTRACTS_LOAD_SUCCESS,
  SMART_CONTRACTS_SET_ACTIVE_CONTRACT,
  SMART_CONTRACTS_SET_ACTIVE_CONTRACT_SUCCESS,
  SMART_CONTRACTS_START_DEBUGGING,
  SMART_CONTRACTS_STOP_DEBUGGING
} from '@smart-contracts/smart-contracts/smart-contracts.actions';
import { State } from '@app/app.reducers';
import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';

const initialState: SmartContractsState = {
  contracts: [],
  activeContract: undefined,
  trace: undefined,
  debug: false,
};

export function reducer(state: SmartContractsState = initialState, action): SmartContractsState {

  switch (action.type) {

    case SMART_CONTRACTS_LOAD_SUCCESS: {
      return {
        ...state,
        contracts: action.payload.contracts,
      };
    }

    case SMART_CONTRACTS_SET_ACTIVE_CONTRACT: {
      return {
        ...state,
        activeContract: action.payload,
        trace: undefined,
        debug: false
      };
    }

    case SMART_CONTRACTS_SET_ACTIVE_CONTRACT_SUCCESS: {
      return {
        ...state,
        trace: action.payload
      };
    }

    case SMART_CONTRACTS_START_DEBUGGING: {
      return {
        ...state,
        debug: true
      };
    }

    case SMART_CONTRACTS_STOP_DEBUGGING: {
      return {
        ...state,
        debug: false
      };
    }

    default:
      return state;

  }

}

export const selectSmartContracts = (state: State): SmartContract[] => state.smartContracts.contracts;
export const selectSmartContractsActiveContract = (state: State): SmartContract => state.smartContracts.activeContract;
