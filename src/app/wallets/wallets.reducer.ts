const initialState: any = {
    initWallets: [],
    ids: [],
    entities: {},
    selectedWallet: null,
    form: {
        to: '',
        amount: 1,
        fee: 0.01,
    },
    transferError: false
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
                transferError: false,
            }
        }
        case 'SELECT_WALLET': {
            return {
                ...state,
                selectedWallet: action.payload,
                form: initialState.form,
                transferError: false,
            }
        }
        case 'WALLET_TRANSACTION_SUCCESS':{
            return {
                ...state,
                transferError: false
            }
        }
        case 'WALLET_TRANSACTION_ERROR': {
            return {
                ...state,
                transferError: true
            }
        }
        
        default:
            return state;
    }
}