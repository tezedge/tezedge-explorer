import { ACTIONS_SUBJECT_PROVIDERS } from '@ngrx/store/src/actions_subject';

const initialState: any = {
    ids: [],
}


function bufferToHex(buffer) {
    return Array
        .from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}
export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'STORAGE_ACTION_LOAD': {
            return {
                ...state,
            }
        }

        case 'STORAGE_ACTION_LOAD_SUCCESS': {

            // console.log('[STORAGE_ACTION_LOAD_SUCCESS]', action.payload);
            return {
                ...state,
                ids: action.payload,
                entities: action.payload.map(action => {

                    if (action.hasOwnProperty('Set')) {

                        // console.log('[action] Set', action.Set.value, new TextDecoder("utf-8").decode(new Uint8Array(action.Set.value)), bufferToHex(new Uint8Array(action.Set.value)) );

                        return {
                            'Set': {
                                ...action.Set,
                                text: new TextDecoder("utf-8").decode(new Uint8Array(action.Set.value)),
                                hex: bufferToHex(new Uint8Array(action.Set.value))
                            }
                        };
                    }

                    if (action.hasOwnProperty('Delete')) {
                        return action;
                    }

                    if (action.hasOwnProperty('RemoveRecord')) {
                        return action;
                    }

                    return action;
                })
            }
        }

        default:
            return state;
    }
}
