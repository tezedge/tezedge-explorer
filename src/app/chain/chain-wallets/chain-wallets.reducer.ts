const initialState: any = {
	wallets: []
};

export function reducer(state = initialState, action) {
	switch (action.type) {
		case 'CHAIN_WALLETS_ADD_WALLET': {
			return {
					...state,
					wallets: [
						...state.wallets,
						{
							...action.payload,
							alias: `bootstrap${state.wallets.length+1}`,
							balance: "1000000000000",
							bakingEnabled: true
						}
					]
			}
		}
		default:
			return state;
	}
}