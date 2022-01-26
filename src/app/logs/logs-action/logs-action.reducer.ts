import { LogsAction } from '@shared/types/logs/logs-action.type';
import { LogsActionEntity } from '@shared/types/logs/logs-action-entity.type';
import { VirtualScrollActivePage } from '@shared/types/shared/virtual-scroll-active-page.type';
import {
  LOGS_ACTION_FILTER,
  LOGS_ACTION_LOAD_SUCCESS,
  LOGS_ACTION_RESET,
  LOGS_ACTION_START,
  LOGS_ACTION_START_SUCCESS,
  LOGS_ACTION_STOP,
  LOGS_ACTION_TIME_LOAD
} from '@logs/logs-action/logs-action.actions';
import { toReadableDate } from '@helpers/date.helper';

const initialState: LogsAction = {
  ids: [],
  entities: {},
  lastCursorId: 0,
  filter: {
    trace: false,
    debug: false,
    info: false,
    notice: false,
    warning: false,
    error: false,
    fatal: false
  },
  stream: false,
  activePage: {},
  pages: [],
  timestamp: undefined,
};

export function reducer(state: LogsAction = initialState, action): LogsAction {
  switch (action.type) {

    case LOGS_ACTION_START_SUCCESS:
    case LOGS_ACTION_LOAD_SUCCESS: {
      const entities = setEntities(action, state);
      const activePage = setActivePage(entities, action);

      return {
        ...state,
        ids: setIds(action),
        entities,
        activePage,
        lastCursorId: setLastCursorId(action),
        pages: setPages(activePage, state),
        timestamp: action.payload.timestamp,
      };
    }

    case LOGS_ACTION_TIME_LOAD:
    case LOGS_ACTION_FILTER: {
      const stateFilter = {
        ...state.filter,
        [action.payload.filterType]: action.payload.filterType ? !state.filter[action.payload.filterType] : false
      };

      return {
        ...state,
        stream: false,
        filter: stateFilter
      };
    }

    case LOGS_ACTION_STOP: {
      return {
        ...state,
        stream: false
      };
    }

    case LOGS_ACTION_START: {
      return {
        ...state,
        stream: true
      };
    }

    case LOGS_ACTION_RESET: {
      return {
        ...initialState
      };
    }

    default:
      return state;
  }
}

export function setIds(action): number[] {
  if (!action.payload.logs.length) {
    return [];
  }

  return action.payload.logs
    .map((item, index) => index)
    .sort((a, b) => a - b);
}

export function setEntities(action, state): { [id: string]: LogsActionEntity } {
  return action.payload.logs.length === 0
    ? {}
    : action.payload.logs.reduce((accumulator, log) => {
      const virtualScrollId = setVirtualScrollId(action, state, accumulator);

      return {
        ...accumulator,
        [virtualScrollId]: {
          ...log,
          id: virtualScrollId,
          originalId: log.id,
          datetime: toReadableDate(log.timestamp)
        }
      };
    }, {});
}

export function setLastCursorId(action): number {
  return action.payload.logs.length - 1;
}

export function setVirtualScrollId(action, state, accumulator): number {
  const alreadySetRecords = Object.keys(accumulator);
  return action.payload.logs.length - (alreadySetRecords.length + 1);
}

export function setActivePage(entities, action): VirtualScrollActivePage<LogsActionEntity> {
  if (!action.payload.logs.length) {
    return null;
  }

  return {
    id: entities[action.payload.logs.length - 1].originalId,
    start: entities[0],
    end: entities[action.payload.logs.length - 1],
    numberOfRecords: action.payload.logs.length
  };
}

export function setPages(activePage, state): number[] {
  if (!activePage) {
    return [];
  }

  const pagesArray = [...state.pages];

  if (pagesArray.indexOf(activePage.id) !== -1) {
    return [...state.pages];
  }

  if (Number(pagesArray[pagesArray.length - 1]) < activePage.id) {
    return [activePage.id].sort((a, b) => a - b);
  } else {
    return [...state.pages, activePage.id].sort((a, b) => a - b);
  }

}
