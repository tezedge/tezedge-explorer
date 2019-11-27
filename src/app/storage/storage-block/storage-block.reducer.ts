import { getMatAutocompleteMissingPanelError } from '@angular/material';

const initialState: any = {
}

export function reducer(state = initialState, action) {
    switch (action.type) {
       
        case 'STORAGE_BLOCK_LOAD': {
            return {
                state,
            }
        }

        case 'STORAGE_BLOCK_LOAD_SUCCESS': {
            return {
                ...state,
                ...action.payload,
            }
        }

        default:
            return state;
    }
}