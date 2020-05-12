import { environment } from '../../../environments/environment';

const initialState: any = {
    api: {},
    ids: [],
    entities: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        // load node settings from environment
        case 'SETTINGS_NODE_LOAD': {
            // console.log("[SETTINGS_NODE_LOAD][reducer]", environment, action, environment.api);
            return {
                api: environment.api[1],
                ids: environment.api.map(node => node.id),
                entities: environment.api.reduce((accumulator, node) => ({
                    ...accumulator,
                    [node.id]: {
                        ...node,
                    }
                }), {}),
            }
        }

        // save connected node
        case 'SETTINGS_NODE_LOAD_SUSCCESS': {
            // console.log("[SETTINGS_NODE_LOAD_SUSCCESS][reducer]", action);
            return {
                ...state,
                api: {
                    ...state.api,
                    connected: action.payload.node.id === state.api.id ? true : state.api.connected 
                },
                entities: {
                    ...state.entities,
                    [action.payload.node.id]: {
                        ...action.payload.node,
                        connected: true
                    },
                }
            }
        }

        // save offline node
        case 'SETTINGS_NODE_LOAD_ERROR': {
            // console.log("[SETTINGS_NODE_LOAD_ERROR][reducer]", action);
            return {
                ...state,
                api: {
                    ...state.api,
                    connected: action.payload.node.id === state.api.id ? false : state.api.connected 
                },
                entities: {
                    ...state.entities,
                    [action.payload.node.id]: {
                        ...action.payload.node,
                        connected: false
                    },
                }
            }
        }

        case 'SETTINGS_NODE_CHANGE': {
            // console.log("[SETTINGS_NODE_CHANGE]", action);
            return {
                ...state,
                api: state.entities[action.payload.id] 
            };
        }

        default:
            return state;
    }
}
