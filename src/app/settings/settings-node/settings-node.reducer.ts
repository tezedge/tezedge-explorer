import * as moment from 'moment-mini-ts';
import { environment } from '../../../environments/environment';

const initialState: any = {
    api: {},
    ids: [],
    entities: {},
};

export function reducer(state = initialState, action) {
    switch (action.type) {

        // load node settings from environment
        case 'SETTINGS_NODE_LOAD': {
            // console.log("[SETTINGS_NODE_LOAD][reducer]", environment, action, environment.api);
            return {
                api: state.api.connected ? state.api : environment.api[0],
                ids: environment.api.map(node => node.id),
                entities: environment.api.reduce((accumulator, node) => ({
                    ...accumulator,
                    [node.id]: {
                        ...node,
                        connected: 'pending',
                        header: {},
                    }
                }), {}),
                sandbox: environment.sandbox
            };
        }

        // save connected node
        case 'SETTINGS_NODE_LOAD_SUSCCESS': {
            // console.log("[SETTINGS_NODE_LOAD_SUSCCESS][reducer]", action);
            return {
                ...state,
                // if this is first available api use it
                api: state.api.connected !== true ? { ...action.payload.api, connected: true } : state.api,
                entities: {
                    ...state.entities,
                    [action.payload.api.id]: {
                        ...action.payload.api,
                        connected: true,
                        header: action.payload.response,
                        relativeDatetime: moment(action.payload.response.timestamp).fromNow(),
                    },
                }
            };
        }

        // save offline node
        case 'SETTINGS_NODE_LOAD_ERROR': {
            // console.log("[SETTINGS_NODE_LOAD_ERROR][reducer]", action);
            return {
                ...state,
                api: {
                    ...state.api,
                    connected: action.payload.api.id === state.api.id ? false : state.api.connected
                },
                entities: {
                    ...state.entities,
                    [action.payload.api.id]: {
                        ...action.payload.api,
                        connected: false,
                        header: {},
                    },
                }
            };
        }

        case 'SETTINGS_NODE_CHANGE': {
            // console.log("[SETTINGS_NODE_CHANGE]", action);
            return {
                ...state,
                api: state.entities[action.payload.api.id]
            };
        }

        default:
            return state;
    }
}
