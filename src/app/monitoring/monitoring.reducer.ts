import { Monitoring } from '../shared/types/monitoring/monitoring.type';
import { MonitoringActions, MonitoringActionTypes } from './monitoring.actions';

const initialState: Monitoring = {
  open: false,
};

export function reducer(state: Monitoring = initialState, action: MonitoringActions): Monitoring {
  switch (action.type) {

    case MonitoringActionTypes.MONITORING_LOAD: {
      return {
        ...state,
        open: true,
      };
    }

    case MonitoringActionTypes.MONITORING_CLOSE: {
      return {
        ...state,
        open: false,
      };
    }

    default:
      return state;

  }
}
