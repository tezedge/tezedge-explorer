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
        backgroundColor: '#242424',
        color: '#bfbfbf',
        toggleButton: {
            isVisible: true,
        },
    },
    toolbar: {
        isVisible: true,
        backgroundColor: 'white',
        color: 'white',
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

        default:
            return state;

    }

}