const initialState = {
    initialized: false,
    sidenav: {
        isVisible: true,
        mode: 'side',
        // backgroundColor: '#2E3748',
        // color: '#F6F9FC',
        backgroundColor: '#1b1b1d',
        color: '#a4a4a5',
        toggleButton: {
            isVisible: true,
        },
    },
    toolbar: {
        isVisible: true,
        backgroundColor: '#2E3748',
        color: '#F6F9FC',
        // backgroundColor: 'white',
        // color: '#1A1E2A',
    },
    logo: {
        isVisible: true,
    },
    version: {
        update: false,
        type: 'web',
        value: '',
        valueUpdate: '',
    },
    menu: {
        monitoring: {
            synchronization: false,
        },
        explorer: {
            mempool: false,
            endpoints: false,
            network: false,
            storage: false,
            logs: false,
        },
        sandbox: {
            chain: false,
            wallets: false,
        }
    },
    theme: {
        name: 'dark',
    },
    statusbar: {
        sandbox: false,
    }

};

export function reducer(state = initialState, action) {

    switch (action.type) {

        case 'APP_INIT_DEFAULT': {
            return {
                ...state,
                menu: initialState.menu,
                statusbar: initialState.statusbar,
            };
        }

        case 'APP_INIT': {

            // TODO: refactor use app features
            let monitoringSynchronization = false;
            let explorerMempool = false;
            let explorerEndpoints = false;
            let explorerNetwork = false;
            let explorerStorage = false;
            let explorerLogs = false;
            let sandboxChain = false;
            let sandboxWallets = false;

            if (action.payload.connected === true) {
                monitoringSynchronization = true;
            }

            explorerStorage = action.payload.ws !== false;

            if (action.payload.debugger !== false) {
                explorerMempool = true;
                explorerEndpoints = true;
                explorerNetwork = true;
                explorerLogs = true;
            }

            if (action.payload.id === 'sandbox-carthage-tezedge') {
                sandboxChain = true;
                sandboxWallets = true;

                monitoringSynchronization = false;
                explorerEndpoints = false;
                explorerNetwork = false;
            }

            return {
                ...state,
                menu: {
                    monitoring: {
                        synchronization: monitoringSynchronization,
                    },
                    explorer: {
                        mempool: explorerMempool,
                        endpoints: explorerEndpoints,
                        network: explorerNetwork,
                        storage: explorerStorage,
                        logs: explorerLogs,
                    },
                    sandbox: {
                        chain: sandboxChain,
                        wallets: sandboxWallets,
                    }
                },
                statusbar: {
                    sandbox: action.payload.id === 'sandbox-carthage-tezedge',
                }
            };
        }

        case 'APP_INIT_SUCCESS': {
            return {
                ...state,
                initialized: true
            };
        }

        case 'APP_THEME_CHANGE': {
            return {
                ...state,
                theme: {
                    ...state.theme,
                    name: action.payload,
                }
            };
        }

        case 'APP_MENU_STATE_CHANGE': {
            return {
                ...state,
                sidenav: {
                    ...state.sidenav,
                    mode: action.payload.mode,
                    isVisible: action.payload.mode !== 'over'
                }
            };
        }

        case 'APP_TOGGLE_SIDENAV': {
            return {
                ...state,
                sidenav: {
                    ...state.sidenav,
                    isVisible: action.payload.isVisible
                }
            };
        }

        case 'SANDBOX_NODE_START_SUCCESS': {
            return {
                ...state,
                statusbar: {
                    sandbox: true,
                }
            };
        }

        case 'SANDBOX_NODE_STOP': {
            return {
                ...state,
                statusbar: {
                    sandbox: false,
                }
            };
        }

        case 'SIDENAV_VISIBILITY_CHANGE': {
            return {
                ...state,
                sidenav: {
                    ...state.sidenav,
                    isVisible: action.payload,
                }
            };
        }


        case 'TOOLBAR_VISIBILITY_CHANGE': {
            return {
                ...state,
                toolbar: {
                    ...state.toolbar,
                    isVisible: action.payload,
                }
            };
        }

        default:
            return state;

    }

}
