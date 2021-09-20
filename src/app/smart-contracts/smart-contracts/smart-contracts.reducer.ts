import { State } from '@app/app.reducers';
import { SmartContractsState } from '@shared/types/smart-contracts/smart-contracts-state.type';

const initialState: SmartContractsState = {
};

export function reducer(state: SmartContractsState = initialState, action): SmartContractsState {

  switch (action.type) {

    case 'SMART_CONTRACTS_INIT': {
      return {
      };
    }

    default:
      return state;

  }

}

export const smartContractsState = (state: State) => state.smartContracts;
