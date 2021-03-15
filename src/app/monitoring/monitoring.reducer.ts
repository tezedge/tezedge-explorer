const initialState: any = {
  open: false,
};

export function reducer(state = initialState, action) {
  switch (action.type) {

    case 'MONITORING_LOAD': {
      return {
        ...state,
        open: true,
      };
    }

    case 'MONITORING_CLOSE': {
      return {
        ...state,
        open: false,
      };
    }

    default:
      return state;

  }
}
