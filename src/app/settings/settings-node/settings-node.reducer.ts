import { environment } from '../../../environments/environment';

const initialState: any = {
    api: {
        ws: 'wss://carthage.tezedge.com',
        http: 'https://carthage.tezedge.com:8732',
    },
    list: [],
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'SETTINGS_INIT': { 
            console.log("[SETTINGS_INIT]", environment, action );
            return {
                ...state
            }
        }

        case 'SETTINGS_NODE_CHANGE': {
            return {
                ...state
            };
        }

        default:
            return state;
    }
}
