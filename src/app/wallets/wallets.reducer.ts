const initialState: any = {
    initWallets: [],
    wallets: []
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case 'HYDRATE_LOCALSTORAGE_WALLETS': {
            return {
                ...state,
                initWallets: action.payload
            }
        }
        case 'WALLET_LIST_LOAD_SUCCESS': {
            return {
                ...state,
                wallets: action.payload
            }
        }
        
        default:
            return state;
    }
}