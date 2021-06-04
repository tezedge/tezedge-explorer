import { App } from './shared/types/app/app.type';

const initialState: App = {
    initialized: false,
    sidenav: {
        isVisible: true,
        mode: 'side',
        collapsed: false,
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
    menu: {
        sandbox: {
            chain: true,
            wallets: true,
        }
    },
    theme: {
        name: 'dark',
    },
    statusbar: {
        sandbox: false,
    }
};

export function reducer(state: App = initialState, action): App {

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
            let sandboxChain = false;
            let sandboxWallets = false;

            if (action.payload.id === 'sandbox-carthage-tezedge') {
                sandboxChain = true;
                sandboxWallets = true;
            }

            return {
                ...state,
                menu: {
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
                    isVisible: action.payload.mode !== 'over',
                    collapsed: false
                }
            };
        }

        case 'APP_MENU_SIZE_CHANGE': {
            return {
                ...state,
                sidenav: {
                    ...state.sidenav,
                    collapsed: action.payload.collapsed
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
