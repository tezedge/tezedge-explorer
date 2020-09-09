const initialState: any = {
    initWallets: [],
    ids: [],
    entities: {},
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
                ids: [
                    ...action.payload.map(wallet => wallet.publicKeyHash)
                ],
                entities: action.payload.reduce((accumulator, wallet) => ({
                    ...accumulator,
                    [wallet.publicKeyHash]: {
                        ...state.entities[wallet.publicKeyHash],
                        ...wallet
                    }
                }), {}),
            }
        }
        
        default:
            return state;
    }
}