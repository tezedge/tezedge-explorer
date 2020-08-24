import { discardPeriodicTasks } from '@angular/core/testing';

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
            endpoints: false,
            network: false,
            storage: false,
            logs: false,
        },
    },
    theme: {
        name: 'dark',
    }

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

            // TODO: refactor use app features
            let monitoringSynchronization = false;
            let explorerEndpoints = false;
            let explorerNetwork = false;
            let explorerStorage = false;
            let explorerLogs = false;


            if (action.payload.connected === true) {
                monitoringSynchronization = true;
            }

            if (action.payload.ws === false) {
                explorerStorage = false;
            } else {
                explorerStorage = true;
            }

            if (action.payload.debugger !== false) {
                explorerEndpoints = true;
                explorerNetwork = true;
                explorerLogs = true;
            }

            return {
                ...state,
                menu: {
                    monitoring: {
                        synchronization: monitoringSynchronization,
                    },
                    explorer: {
                        endpoints: explorerEndpoints,
                        network: explorerNetwork,
                        storage: explorerStorage,
                        logs: explorerLogs,
                    },
                }
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