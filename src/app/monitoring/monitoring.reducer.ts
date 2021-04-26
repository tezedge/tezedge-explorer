import { Monitoring } from '../shared/types/monitoring/monitoring.type';

const initialState: Monitoring = {
  open: false,
};

export function reducer(state: Monitoring = initialState, action): Monitoring {
  switch (action.type) {

    case 'MONITORING_LOAD': {
      return {
        ...state,
        open: true,
      };
    }

    case 'MONITORING_CLOSE': {
      return {
        ...state,
        open: false,
      };
    }

    default:
      return state;

  }
}
