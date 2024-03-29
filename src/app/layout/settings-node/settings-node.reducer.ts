import * as moment from 'moment-mini-ts';
import { environment } from '@environment/environment';
import { SettingsNode } from '@shared/types/settings-node/settings-node.type';
import { SettingsNodeEntityHeader } from '@shared/types/settings-node/settings-node-entity-header.type';
import { State } from '@app/app.index';
import { SettingsNodeApi } from '@shared/types/settings-node/settings-node-api.type';
import { SettingsNodeEntity } from '@shared/types/settings-node/settings-node-entity.type';

const initialState: SettingsNode = {
  activeNode: null,
  ids: [],
  entities: {},
};

export function reducer(state: SettingsNode = initialState, action): SettingsNode {
  switch (action.type) {
    case 'SETTINGS_NODE_LOAD': {
      return {
        activeNode: (state.activeNode && state.activeNode.connected) ? state.activeNode : null,
        ids: environment.api.map(node => node.id),
        entities: environment.api.reduce((accumulator, node) => ({
          ...accumulator,
          [node.id]: {
            ...node,
            connected: 'pending'
          }
        }), {}),
      };
    }

    case 'SETTINGS_NODE_LOAD_SUCCESS': {
      const activeNode = (state.activeNode?.connected !== true || action.payload.activeNode.type === 'tezedge') && !action.payload.checkOnly
        ? { ...action.payload.activeNode, connected: true, features: action.payload.features }
        : state.activeNode;
      localStorage.setItem('activeNode', activeNode.type);
      return {
        ...state,
        activeNode,
        entities: {
          ...state.entities,
          [action.payload.activeNode.id]: {
            ...action.payload.activeNode,
            connected: true,
            header: action.payload.header,
            relativeDateTime: moment(action.payload.header.timestamp).fromNow(),
            features: action.payload.features,
          },
        }
      };
    }

    case 'SETTINGS_NODE_LOAD_ERROR': {
      return {
        ...state,
        activeNode: {
          ...state.activeNode,
          connected: (action.payload.activeNode && state.activeNode && action.payload.activeNode.id === state.activeNode.id)
            ? false : state.activeNode?.connected
        },
        entities: {
          ...state.entities,
          [action.payload.activeNode.id]: {
            ...action.payload.activeNode,
            connected: false,
            header: {},
          },
        }
      };
    }

    case 'SETTINGS_NODE_CHANGE': {
      const activeNode = state.entities[action.payload.activeNode.id];
      localStorage.setItem('activeNode', activeNode.type);
      return {
        ...state,
        activeNode
      };
    }

    case 'SETTINGS_NODE_LOAD_SANDBOX': {
      return {
        ...state,
        entities: {
          ...state.entities,
          ['sandbox-carthage-tezedge']: {
            ...state.entities['sandbox-carthage-tezedge'],
            connected: false,
            header: new SettingsNodeEntityHeader(),
          },
        },
      };
    }

    case 'SETTINGS_NODE_LOAD_SANDBOX_SUCCESS': {
      const activeNode = { ...action.payload.activeNode, connected: true };
      localStorage.setItem('activeNode', activeNode.type);
      return {
        ...state,
        activeNode,
        entities: {
          ...state.entities,
          [action.payload.activeNode.id]: {
            ...action.payload.activeNode,
            connected: true,
            header: action.payload.response,
            relativeDateTime: moment(action.payload.response.timestamp).fromNow(),
          },
        }
      };
    }

    case 'SANDBOX_NODE_STOP_PENDING': {
      return {
        ...state,
        activeNode: state.activeNode.id === 'sandbox-carthage-tezedge' ?
          { ...state.activeNode, connected: 'pending' } : { ...state.activeNode },
        entities: {
          ...state.entities,
          ['sandbox-carthage-tezedge']: {
            ...state.entities['sandbox-carthage-tezedge'],
            connected: 'pending',
          },
        },
      };
    }

    default:
      return state;
  }
}

export const selectActiveNode = (state: State): SettingsNodeApi => state.settingsNode.activeNode;
export const selectFeatures = (state: State) => state.settingsNode.activeNode.features;
export const selectActiveNodeNetwork = (state: State): string => selectActiveNodeHeader(state).network;
export const selectFullActiveNode = (state: State): SettingsNodeEntity => Object.keys(state.settingsNode.entities)
  .map(key => state.settingsNode.entities[key])
  .find(node => node.id === state.settingsNode.activeNode.id);
export const selectActiveNodeHeader = (state: State): SettingsNodeEntityHeader => Object.keys(state.settingsNode.entities)
  .map(key => state.settingsNode.entities[key])
  .find(node => node.id === state.settingsNode.activeNode.id)
  .header;
