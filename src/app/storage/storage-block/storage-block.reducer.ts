import * as moment from 'moment-mini-ts';
import {setVirtualScrollId} from '../../network/network-action/network-action.reducer';
import {VirtualScrollActivePage} from '../../shared/types/shared/virtual-scroll-active-page.type';
import {StorageBlock} from '../../shared/types/storage/storage-block.type';
import {StorageBlockEntity} from '../../shared/types/storage/storage-block-entity.type';

const initialState: StorageBlock = {
  ids: [],
  entities: {},
  lastCursorId: 0,
  stream: false,
  selected: {},
  activePage: {},
  pages: []
};

export function reducer(state: StorageBlock = initialState, action): StorageBlock {
  switch (action.type) {

    // case 'STORAGE_BLOCK_FETCH': {
    //   return {
    //     ...state,
    //     stream: true
    //   };
    // }

    case 'STORAGE_BLOCK_START_SUCCESS':
    case 'STORAGE_BLOCK_FETCH_SUCCESS': {
      const entities = setEntities(action, state);
      const activePage = setActivePage(entities, action);

      return {
        ...state,
        ids: setIds(action),
        entities,
        lastCursorId: setLastCursorId(action),
        activePage,
        pages: setPages(activePage, state),
        // stream: action.type === 'STORAGE_BLOCK_START_SUCCESS'
      };
    }

    case 'STORAGE_BLOCK_STOP': {
      return {
        ...state,
        stream: false
      };
    }

    case 'STORAGE_BLOCK_START': {
      return {
        ...state,
        stream: true
      };
    }

    case 'STORAGE_BLOCK_DETAILS_LOAD_SUCCESS': {
      return {
        ...state,
        selected: action.payload
      };
    }

    case 'STORAGE_BLOCK_RESET_SUCCESS': {
      return {
        ...initialState
      };
    }

    default:
      return state;
  }
}

export function setIds(action): number[] {
  if (!action.payload.length) {
    return [];
  }

  return action.payload
    .map((item, index) => index)
    .sort((a, b) => a - b);
}

export function setEntities(action, state): { [id: string]: StorageBlockEntity } {
  return action.payload.length === 0 ?
    {} :
    action.payload
      .reduce((accumulator, block) => {
        const virtualScrollId = setVirtualScrollId(action, state, accumulator);

        return {
          ...accumulator,
          [virtualScrollId]: {
            hash: block.block_hash,
            id: virtualScrollId,
            originalId: block.level,
            datetime: moment.utc(Number(block.timestamp)).format('HH:mm:ss.SSS, DD MMM YY'),
            cyclePosition: block.cycle_position !== undefined ? block.cycle_position : ''
          }
        };
      }, {});

  // return action.payload
  //   .reduce((accumulator, logsAction) => {
  //     return {
  //       ...accumulator,
  //       [logsAction.id]: {
  //         ...logsAction,
  //         datetime: moment.utc(Math.ceil(logsAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')
  //       }
  //     };
  //   }, {});
}

export function setLastCursorId(action): number {
  return action.payload.length - 1;
}

export function setActivePage(entities, action): VirtualScrollActivePage {
  if (!action.payload.length) {
    return {};
  }

  return {
    id: entities[action.payload.length - 1].originalId,
    start: entities[0],
    end: entities[action.payload.length - 1],
    numberOfRecords: action.payload.length
  };
}

export function setPages(activePage, state): number[] {
  if (!activePage.id) {
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
