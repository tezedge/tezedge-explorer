const initialState: any = {
    initWallets: [],
    ids: [],
    entities: {},
    selectedWalletId: null,
    form: {
        to: '',
        amount: 1,
        fee: 0.01,
    },
    transferError: false
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case 'WALLET_LIST_INIT_SUCCESS': {
            const wallets = mapWallets(action.payload);
            return {
                ...state,
                ids: [
                    ...wallets.map(wallet => wallet.publicKeyHash)
                ],
                entities: wallets.reduce((accumulator, wallet) => ({
                    ...accumulator,
                    [wallet.publicKeyHash]: {
                        ...state.entities[wallet.publicKeyHash],
                        ...wallet
                    }
                }), {}),
                transferError: false,
            }
        }
        case 'WALLET_LIST_LOAD_SUCCESS': {
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [action.payload.wallet.publicKeyHash]: {
                        ...state.entities[action.payload.wallet.publicKeyHash],
                        ...action.payload.getWallet,
                        timestamp: new Date().getTime(),
                    }
                },
                selectedWalletId: state.selectedWalletId ? state.selectedWalletId : state.ids[0],
            }
        }
        case 'SELECT_WALLET': {
            return {
                ...state,
                selectedWalletId: action.payload,
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

export function mapWallets(payload: any[]){
    const wallets = [];
    payload.forEach((item)=>{
        const wallet = {
            alias: item.alias,
            secretKey: item.secret_key,
            publicKey: item.public_key,
            publicKeyHash: item.public_key_hash,
        }
        wallets.push(wallet);
    });
    return wallets;
}