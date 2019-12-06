import * as blake2b from 'blake2b';
import * as bs58check from 'bs58check';
import { Buffer } from 'buffer';

const initialState: any = {
    ids: [],
    entities: []
}


function bufferToHex(buffer) {
    return Array
        .from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}
export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'STORAGE_ACTION_LOAD': {
            return {
                ...state,
            }
        }

        case 'STORAGE_ACTION_LOAD_SUCCESS': {

            // console.log('[STORAGE_ACTION_LOAD_SUCCESS]', action.payload);
            return {
                ...state,
                ids: action.payload,
                entities: action.payload.map(action => {

                    if (action.hasOwnProperty('Set')) {

                        return {
                            Set: {
                                ...action.Set,
                                key: parseKey(action.Set.key),
                                text: new TextDecoder('utf-8').decode(new Uint8Array(action.Set.value)),
                                hex: bufferToHex(new Uint8Array(action.Set.value)),
                                category: action.Set.key[0] === 'data' ? action.Set.key[1] : action.Set.key[0],
                                color: categoryColor(action.Set.key[0] === 'data' ? action.Set.key[1] : action.Set.key[0])
                            }
                        };
                    }

                    if (action.hasOwnProperty('Delete')) {
                        return action;
                    }

                    if (action.hasOwnProperty('RemoveRecord')) {
                        return action;
                    }

                    return action;
                })
            }
        }

        default:
            return state;
    }
}

export function parseKey(key) {

    // process block priority
    if ((key.indexOf("block_priority") > 0)) {
        key = key.filter((value, index) => {
            return (index > 2) ? true : false;
        })
    }
    // process contract
    if ((key.indexOf("contracts") > 0) && (key.indexOf("index") > 0)) {
        key = key
            .filter((value, index) => {
                // remove index from path
                return (index > 8) ? true : false;
            }).map((value, index) => {

                if (index === 0) {


                    // get blake2b hash
                    const hash = blake2b(20).update(Buffer.from(value)).digest('hex')
                    console.log(value, hash);

                    return hash;
                }
                return value
            })
    }

    // process delegates_with_frozen_balance
    if ((key.indexOf("delegates_with_frozen_balance") > 0)) {
        key = key
        .filter((value, index) => {
            return ((index > 1 && index < 4) || index > 8) ? true : false;
        }).map((value, index) => {

            // convert hex to blake2b
            if (index === 0) {

                console.log(blake.blake2bHex('value'))
                return value
            };

            return value
        })
    }

    // process active_delegates_with_rolls
    if ((key.indexOf("active_delegates_with_rolls") > 0)) {
        key = key.filter((value, index) => {
            return ((index > 1 && index < 3) || index > 7) ? true : false;
        })
    }

    // replace , with / 
    return key.length > 0 ? '/' + key.toString().replace(/,/g, '/') : '';
}

export function categoryColor(category) {
    switch (category) {
        case 'active_delegates_with_rolls': {
            return 'red';
        }
        case 'big_maps': {
            return 'green';
        }
        case 'block_priority': {
            return 'green';
        }
        case 'commitments': {
            return 'red';
        }
        case 'contracts': {
            return 'darkblue';
        }
        case 'cycle': {
            return 'darkgreen';
        }
        case 'delegates': {
            return 'red';
        }
        case 'delegates_with_frozen_balance': {
            return 'red';
        }
        case 'ramp_up': {
            return 'yellow';
        }
        case 'rolls': {
            return 'lightblue';
        }
        case 'votes': {
            return 'lightblue';
        }

        default:
            return 'black';
    }
}


export const prefix = {
    tz1: new Uint8Array([6, 161, 159]),
    tz2: new Uint8Array([6, 161, 161]),
    tz3: new Uint8Array([6, 161, 164]),
    KT1: new Uint8Array([2, 90, 121]),
    B: new Uint8Array([1, 52]),
    edpk: new Uint8Array([13, 15, 37, 217]),
    sppk: new Uint8Array([3, 254, 226, 86]),
    p2pk: new Uint8Array([3, 178, 139, 127]),
    edsk64: new Uint8Array([43, 246, 78, 7]),
    edsk32: new Uint8Array([13, 15, 58, 7]),
    edsig: new Uint8Array([9, 245, 205, 134, 18]),
    operation: new Uint8Array([5, 116]),
}

export function bs58checkEncode(this: void, prefix: Uint8Array, payload: Uint8Array) {
    const n = new Uint8Array(prefix.length + payload.length);

    n.set(prefix);
    n.set(payload, prefix.length);

    return bs58check.encode(Buffer.from(n));
}