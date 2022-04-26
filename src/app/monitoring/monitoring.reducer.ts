import { Monitoring } from '@shared/types/monitoring/monitoring.type';
import { MonitoringActions } from './monitoring.actions';

const initialState: Monitoring = {
};

export function reducer(state: Monitoring = initialState, action: MonitoringActions): Monitoring {
  switch (action.type) {

    default:
      return state;

  }
}
