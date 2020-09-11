const initialState: any = {
    initWallets: [],
    ids: [],
    entities: {},
    selectedWallet: null,
    form: {
        to: '',
        amount: 1,
        fee: 0.01,
    }
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
        case 'SELECT_WALLET': {
            return {
                ...state,
                selectedWallet: action.payload
            }
        }
        
        default:
            return state;
    }
}