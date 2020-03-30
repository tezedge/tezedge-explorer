import * as moment from 'moment-mini-ts';

const initialState: any = {
    ids: [],
    entities: {},
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'NETWORK_ACTION_LOAD_SUCCESS': {

            // console.log('[NETWORK_ACTION_LOAD_SUCCESS]', action );

            return {
                ...state,
                // TODO: replace with id
                ids: [
                    ...Array(action.payload.length).keys()
                ],
                entities: action.payload
                    .reduce((accumulator, networkAction, index) => {

                        // process TcpMessage
                        if (networkAction.hasOwnProperty('TcpMessage')) {
                            return {
                                ...accumulator,
                                [index]: {
                                    ...networkAction.TcpMessage,
                                    type: 'TcpMessage',
                                    message: 'packet', //networkAction.TcpMessage.packet,
                                    datetime: moment(networkAction.timestamp).format('HH:mm:ss,  DD MMM YYYY'),
                                }
                            };
                        }

                        if (networkAction.hasOwnProperty('ConnectionMessage')) {
                            return {
                                ...accumulator,
                                [index]: {
                                    ...networkAction.ConnectionMessage,
                                    type: 'ConnectionMessage',
                                    message: networkAction.ConnectionMessage.payload,
                                    datetime: moment(networkAction.timestamp).format('HH:mm:ss,  DD MMM YYYY'),
                                }
                            };
                        }


                        if (networkAction.hasOwnProperty('P2PMessage')) {
                            return {
                                ...accumulator,
                                [index]: {
                                    ...networkAction.P2PMessage,
                                    type: 'P2PMessage',
                                    message: networkAction.P2PMessage.payload,
                                    datetime: moment(networkAction.timestamp).format('HH:mm:ss,  DD MMM YYYY'),
                                }
                            };
                        }

                    }, {}),
            };
        }

        default:
            return state;
    }
}