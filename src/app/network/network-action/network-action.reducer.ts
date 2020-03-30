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
                ids: action.payload
                    .map(networkAction => networkAction.id),
                entities: action.payload
                    .reduce((accumulator, networkAction) => {



                        if (networkAction.type === 'connection_message') {

                            console.log("[connection_message]", networkAction);

                            return {
                                ...accumulator,
                                [networkAction.id]: {
                                    ...networkAction,
                                    category: 'Connection',
                                    kind: '',
                                    payload: networkAction.message,
                                    preview: networkAction.message.substring(0, 20) + '...' ,
                                    datetime: moment.utc(Math.ceil(networkAction.timestamp/1000000)).format('HH:mm:ss.SSS, DD MMM YY'),
                                }
                            };
                        }

                        if (networkAction.type === 'p2p_message') {

                            console.log("[p2p_message]", networkAction);

                            let payload = { ...networkAction.message[0] };
                            delete payload.type;
                            let preview = JSON.stringify(payload);
                            return {
                                ...accumulator,
                                [networkAction.id]: {
                                    ...networkAction,
                                    category: 'P2P',
                                    kind: networkAction.message[0].type,
                                    payload: payload,
                                    preview: preview.length > 20 ? preview.substring(0, 20) + '...' :  '' ,
                                    datetime: moment.utc(Math.ceil(networkAction.timestamp/1000000)).format('HH:mm:ss.SSS, DD MMM YY'),
                                }
                            };
                        }

                        console.log("[default]", networkAction);

                        return {
                            ...accumulator,
                            [networkAction.id]: {
                                ...networkAction,
                                payload: networkAction.message,
                                datetime: moment.utc(Math.ceil(networkAction.timestamp/1000000)).format('HH:mm:ss.SSS, DD MMM YY'),

                            }
                        };

                        // if (networkAction.hasOwnProperty('p2p_message')) {
                        //     return {
                        //         ...accumulator,
                        //         [index]: {
                        //             ...networkAction.P2PMessage,
                        //             category: 'P2P',
                        //             type: Object.getOwnPropertyNames(networkAction.P2PMessage.payload[0])[0],
                        //             message: networkAction.P2PMessage.payload[0][Object.getOwnPropertyNames(networkAction.P2PMessage.payload[0])[0]],
                        //             datetime: moment(networkAction.ts).format('HH:mm:ss,  DD MMM YYYY'),
                        //         }
                        //     };
                        // }

                    }, {}),
            };
        }

        default:
            return state;
    }
}