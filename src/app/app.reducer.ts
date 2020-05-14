const initialState = {

    user: {
        uid: null,
        email: null,
        displayName: null,
    },
    progressbar: {
        isVisible: false,
        counter: 0,
    },
    sidenav: {
        isVisible: true,
        mode: 'side',
        backgroundColor: '#2E3748',
        color: '#F6F9FC',
        // backgroundColor: 'white',
        // color: '#1A1E2A',
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
    monitoring: {
        open: false
    },
    menu: {
        monitoring: {
            synchronization: false,
        },
        explorer: {
            endpoints: false,
            network: false,
            storage: false,
        },
    },

};

export function reducer(state = initialState, action) {

    switch (action.type) {

        case 'APP_WINDOW': {
            const MOBILE_WIDTH = 450;
            return {
                ...state,
                sidenav: {
                    ...state.sidenav,
                    isVisible: action.payload.width > MOBILE_WIDTH ? true : false,
                    mode: action.payload.width > MOBILE_WIDTH ? 'side' : 'over',
                    toggleButton: {
                        isVisible: action.payload.width < MOBILE_WIDTH ? true : false,
                    }
                }
            };
        }


        case 'APP_INIT': {

            if (action.payload.connected === false) {
                return {
                    ...state,
                    menu: {
                        monitoring: {
                            synchronization: false,
                        },
                        explorer: {
                            endpoints: false,
                            network: false,
                            storage: false,
                        },
                    },
                };
            }

            return {
                ...state,
                menu: action.payload.ws === false ?
                    {
                        monitoring: {
                            synchronization: true,
                        },
                        explorer: {
                            endpoints: true,
                            network: true,
                            storage: false,
                        },
                    } :
                    {
                        monitoring: {
                            synchronization: true,
                        },
                        explorer: {
                            endpoints: false,
                            network: true,
                            storage: true,
                        },
                    },
            };
        }

        case 'MONITORING_OPEN': {
            return {
                ...state,
                monitoring: {
                    open: true,
                }
            };
        }

        case 'MONITORING_CLOSE': {
            return {
                ...state,
                monitoring: {
                    open: false,
                }
            };
        }

        // probress bar show
        case 'NETWORK_ACTION_LOAD':
        case 'STORAGE_BLOCK_LOAD':
        case 'STORAGE_BLOCK_ACTION_LOAD': {
            return {
                ...state,
                progressbar: {
                    isVisible: state.progressbar.counter >= 0 ? true : false,
                    counter: state.progressbar.counter + 1
                }
            };
        }

        // probress bar hide
        case 'NETWORK_ACTION_LOAD_ERROR':
        case 'STORAGE_BLOCK_LOAD_ERROR':
        case 'STORAGE_BLOCK_ACTION_LOAD_ERROR':

        case 'NETWORK_ACTION_LOAD_SUCCESS':
        case 'STORAGE_BLOCK_LOAD_SUCCESS':
        case 'STORAGE_BLOCK_ACTION_LOAD_SUCCESS': {
            return {
                ...state,
                progressbar: {
                    isVisible: state.progressbar.counter === 1 ? false : true,
                    counter: state.progressbar.counter - 1,
                }
            };
        }

        default:
            return state;

    }

}