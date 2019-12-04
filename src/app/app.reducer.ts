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
        // backgroundColor: '#242424',
        // color: '#bfbfbf',
        backgroundColor: 'whitesmoke',
        color: 'black',
        toggleButton: {
            isVisible: true,
        },
    },
    toolbar: {
        isVisible: true,
        backgroundColor: 'white',
        color: 'black',
    },
    logo: {
        isVisible: true,
    },
    version: {
        update: false,
        type: 'web',
        value: '',
        valueUpdate: '',
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
            }
        }

        default:
            return state;

    }

}