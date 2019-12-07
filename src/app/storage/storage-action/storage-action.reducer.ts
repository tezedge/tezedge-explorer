import * as blake2b from 'blake2b';
import * as bs58check from 'bs58check';
import { Buffer } from 'buffer';
import { getMatIconFailedToSanitizeLiteralError } from '@angular/material';

const initialState: any = {
    ids: [],
    entities: []
}


function bufferToHex(buffer) {
    return Array
        .from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'STORAGE_ACTION_LOAD': {
            return {
                ...state,
            }
        }

        case 'STORAGE_ACTION_LOAD_SUCCESS': {
            // clone action
            let _action = JSON.parse(JSON.stringify(action));

            // get time stamp
            function get_time(action) {
                if (action.hasOwnProperty('Set')) {
                    return action.Set.start_time;
                }
                if (action.hasOwnProperty('Delete')) {
                    return action.Delete.start_time;
                }
                if (action.hasOwnProperty('RemoveRecord')) {
                    return action.RemoveRecord.start_time;
                }
            }

            // sort actions by timestamp
            _action.payload.sort((a, b) => {
                const aa = get_time(a);
                const bb = get_time(b);
                return aa - bb;
            });

            let actionPreviousTimestamp = 0;
            // console.log('[STORAGE_ACTION_LOAD_SUCCESS]', action.payload);
            return {
                ...state,
                ids: _action.payload,
                entities: _action.payload.map(action => {

                    if (action.hasOwnProperty('Set')) {
                        const result = {
                            Set: {
                                ...action.Set,
                                key: parseKey(action.Set.key),
                                value: parseValue(action.Set.key, action.Set.value),
                                text: new TextDecoder('utf-8').decode(new Uint8Array(action.Set.value)),
                                hex: bufferToHex(new Uint8Array(action.Set.value)),
                                category: action.Set.key[0] === 'data' ? action.Set.key[1] : action.Set.key[0],
                                lastKey: action.Set.key[action.Set.key.length - 1],
                                color: categoryColor(action.Set.key[0] === 'data' ? action.Set.key[1] : action.Set.key[0]),
                                json: action.Set.value_as_json,
                                start_time: action.Set.start_time,
                                timeStorage: Math.floor((action.Set.end_time - action.Set.start_time) * 1000000),
                                timeProtocol: actionPreviousTimestamp !== 0 ?
                                    Math.floor((action.Set.start_time - actionPreviousTimestamp) * 1000000) : 0,
                            }
                        };
                        // save prev timestamp
                        actionPreviousTimestamp = action.Set.end_time;
                        return result;
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
    if ((key.indexOf('block_priority') > 0)) {
        key = key.filter((value, index) => {
            return (index > 2) ? true : false;
        })
    }
    // process contract
    if ((key.indexOf('contracts') > 0) && (key.indexOf('index') > 0)) {
        key = key
            .filter((value, index) => {
                // remove index from path
                return (index > 8) ? true : false;
            }).map((value, index) => {

                if (index === 0) {

                    // convert contract hex to string
                    let addressPrefix = new Uint8Array();
                    let address = '';
                    if (value.substring(0, 4) === '0000') { addressPrefix = prefix.tz1; address = value.substr(4); }
                    if (value.substring(0, 4) === '0001') { addressPrefix = prefix.tz2; address = value.substr(4); }
                    if (value.substring(0, 4) === '0002') { addressPrefix = prefix.tz3; address = value.substr(4); }
                    if (value.substring(0, 2) === '01') { addressPrefix = prefix.KT1; address = value.substr(2, value.length - 4); }

                    const hash = bs58checkEncode(addressPrefix, Buffer.from(address, 'hex'));
                    return hash;
                }
                return value
            })
    }

    // process delegates_with_frozen_balance
    if ((key.indexOf('delegates_with_frozen_balance') > 0)) {
        key = key
            .filter((value, index) => {
                return ((index > 1 && index < 4) || index > 8) ? true : false;
            }).map((value, index) => {
                return value
            })
    }

    // process active_delegates_with_rolls
    if ((key.indexOf('active_delegates_with_rolls') > 0)) {
        key = key.filter((value, index) => {
            return ((index > 1 && index < 3) || index > 7) ? true : false;
        })
    }

    //  remove last element
    // key.pop()

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


export function zarithDecode(hex) {
    let count = 0;
    let value = 0;
    while (1) {
        const byte = Number('0x' + hex.slice(0 + count * 2, 2 + count * 2));
        value += ((byte & 127) * (128 ** count));
        count++;
        if ((byte & 128) !== 128) {
            break;
        }
    }
    return value;
}

export function parseValue(key, value) {

    // value encodings
    const encodings: any = [
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'delegate_desactivation'], 'empty_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'frozen_balance', '*', 'rewards'], 'empty_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'frozen_balance', '*', 'deposits'], 'empty_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'frozen_balance', '*', 'fees'], 'empty_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'balance'], 'Tez_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'change'], 'empty_repr'],

        [['data', 'delegates_with_frozen_balance', '*', '*', '*', '*', '*', '*', '*', '*'], 'empty_repr'],
        [['data', 'active_delegates_with_rolls', '*', '*', '*', '*', '*', '*', '*'], 'empty_repr'],
        [['data', 'block_priority'], 'empty_repr'],

        [['data', 'contracts', 'global_counter'], 'empty_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'counter'], 'empty_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'manager'], 'empty_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'len', 'code'], 'empty_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'len', 'storage'], 'empty_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'data', 'code'], 'empty_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'data', 'storage'], 'empty_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'used_bytes'], 'empty_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'paid_bytes'], 'empty_repr'],

        [['data', 'big_maps', 'index', '*', '*', '*', '*', '*', '*', '*', 'contents', '*', '*', '*', '*', '*', '*', 'len'], 'empty_repr'],
        [['data', 'big_maps', 'index', '*', '*', '*', '*', '*', '*', '*', 'contents', '*', '*', '*', '*', '*', '*', 'data'], 'empty_repr'],
        [['data', 'big_maps', 'index', '*', '*', '*', '*', '*', '*', '*', 'total_bytes'], 'empty_repr'],
        [['data', 'big_maps', 'next'], ''],
        [['data', 'big_maps', 'index', '*', '*', '*', '*', '*', '*', '*', 'key_type'], 'empty_repr'],
        [['data', 'big_maps', 'index', '*', '*', '*', '*', '*', '*', '*', 'value_type'], 'empty_repr'],
        [['data', 'cycle', '*', 'nonces', '*'], 'empty_repr'],

        [['data', 'version'], 'empty_repr'],
        [['protocol'], 'empty_repr'],
        [['test_chain'], 'empty_repr'],

    ];

    // encoding representation
    let encoding: any = '';

    // check encodings
    const isEncoding = encodings.some(code => {

        // check every kkey from encoding path
        const match = code[0].every((item, index) => {
            // console.log('[item]', item, key[index]);
            if (key[index]) {
                if ((item === '*') || (key[index] === item)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        });
        if (match) {
            // console.log('[parseValue]', match, code[0], key);
            // save encoding
            encoding = code[1];
        }
        return match;
    });

    if (!isEncoding) {
        console.log('[encoding]', encoding, key, value);
    }

    // call encoding function
    switch (encoding) {
        case 'Tez_repr': return Tez_repr(value);
        default: return false;
    }
}

export function Tez_repr(value) {
    const hexValue = bufferToHex(new Uint8Array(value));
    return (zarithDecode(hexValue) / 1000000) + 'ꜩ';
}
