import * as blake2b from 'blake2b';
import * as bs58check from 'bs58check';
import { Buffer } from 'buffer';

const initialState: any = {
    ids: [],
    entities: [],
    blocks: []
}


function bufferToHex(buffer) {
    return Array
        .from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'STORAGE_BLOCK_ACTION_LOAD': 
        case 'STORAGE_ADDRESS_ACTION_LOAD': {
            return {
                ...initialState,
            }
        }

        case 'STORAGE_BLOCK_ACTION_LOAD_SUCCESS':
        case 'STORAGE_ADDRESS_ACTION_LOAD_SUCCESS': {
            // clone action
            let _action = JSON.parse(JSON.stringify(action));

            // get time stamp
            function get_time(action) {
                if (action.hasOwnProperty('Get')) {
                    return action.Get.start_time;
                }
                if (action.hasOwnProperty('Set')) {
                    return action.Set.start_time;
                }
                if (action.hasOwnProperty('Mem')) {
                    return action.Mem.start_time;
                }
                if (action.hasOwnProperty('DirMem')) {
                    return action.DirMem.start_time;
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
            let result = {
                ...state,
                blocks: _action.payload.reduce((accum, action) => {

                    if (action.hasOwnProperty('Set')) {
                        const blockHash = Block_repr(action.Set.block_hash);
                        return accum.indexOf(blockHash) !== -1 ?
                            accum :
                            [
                                ...accum,
                                blockHash
                            ];
                    }
                    
                    if (action.hasOwnProperty('Get')) {
                        const blockHash = Block_repr(action.Get.block_hash);
                        return accum.indexOf(blockHash) !== -1 ?
                            accum :
                            [
                                ...accum,
                                blockHash
                            ];
                    }

                    if (action.hasOwnProperty('Mem')) {
                        const blockHash = Block_repr(action.Mem.block_hash);
                        return accum.indexOf(blockHash) !== -1 ?
                            accum :
                            [
                                ...accum,
                                blockHash
                            ];
                    }

                    if (action.hasOwnProperty('DirMem')) {
                        const blockHash = Block_repr(action.DirMem.block_hash);
                        return accum.indexOf(blockHash) !== -1 ?
                            accum :
                            [
                                ...accum,
                                blockHash
                            ];
                    }

                    if (action.hasOwnProperty('Del')) {
                        const blockHash = Block_repr(action.Del.block_hash);
                        return accum.indexOf(blockHash) !== -1 ?
                            accum :
                            [
                                ...accum,
                                blockHash
                            ];
                    }
         
                    if (action.hasOwnProperty('RemoveRecord')) {
                        const blockHash = Block_repr(action.RemoveRecord.block_hash);
                        return accum.indexOf(blockHash) !== -1 ?
                            accum :
                            [
                                ...accum,
                                blockHash
                            ];
                    }

                    return accum;
                }, []).reverse(),

                ids: _action.payload.reduce((accum, action) => {

                    if (action.hasOwnProperty('Set')) {
                        const blockHash = Block_repr(action.Set.block_hash);
                        const blockActions = accum[blockHash] ? accum[blockHash] : [];
                        return {
                            ...accum,
                            [blockHash]: [
                                ...blockActions,
                                action.Set.start_time
                            ]
                        };
                    }

                    if (action.hasOwnProperty('Get')) {
                        const blockHash = Block_repr(action.Get.block_hash);
                        const blockActions = accum[blockHash] ? accum[blockHash] : [];
                        return {
                            ...accum,
                            [blockHash]: [
                                ...blockActions,
                                action.Get.start_time
                            ]
                        };
                    }

                    if (action.hasOwnProperty('Mem')) {
                        const blockHash = Block_repr(action.Mem.block_hash);
                        const blockActions = accum[blockHash] ? accum[blockHash] : [];
                        return {
                            ...accum,
                            [blockHash]: [
                                ...blockActions,
                                action.Mem.start_time
                            ]
                        };
                    }

                    if (action.hasOwnProperty('DirMem')) {
                        const blockHash = Block_repr(action.DirMem.block_hash);
                        const blockActions = accum[blockHash] ? accum[blockHash] : [];
                        return {
                            ...accum,
                            [blockHash]: [
                                ...blockActions,
                                action.DirMem.start_time
                            ]
                        };
                    }

                    if (action.hasOwnProperty('Del')) {
                        const blockHash = Block_repr(action.Del.block_hash);
                        const blockActions = accum[blockHash] ? accum[blockHash] : [];
                        return {
                            ...accum,
                            [blockHash]: [
                                ...blockActions,
                                action.Del.start_time
                            ]
                        };
                    }


                    if (action.hasOwnProperty('RemoveRecord')) {
                        const blockHash = Block_repr(action.RemoveRecord.block_hash);
                        const blockActions = accum[blockHash] ? accum[blockHash] : [];
                        return {
                            ...accum,
                            [blockHash]: [
                                ...blockActions,
                                action.RemoveRecord.start_time
                            ]
                        };
                    }

                    return accum;

                }, []),

                entities: _action.payload
                    // show only set operations
                    //.filter(action => action.hasOwnProperty('Set'))
                    //.filter(action => action.hasOwnProperty('Get'))
                    .reduce((accum, action) => {

                        if (action.hasOwnProperty('Set')) {
                            
                            const result = {
                                // ...action.Set,
                                type: 'SET',
                                key: parseKey(action.Set.key),
                                value: parseValue(action.Set.key, action.Set.value),
                                // text: new TextDecoder('utf-8').decode(new Uint8Array(action.Set.value)),
                                hex: '0x' + bufferToHex(new Uint8Array(action.Set.value)),
                                category: action.Set.key[0] === 'data' ? action.Set.key[1] : action.Set.key[0],
                                address: action.Set.key[1] === 'contracts' ? bytes2address(action.Set.key[9]) : '',
                                lastKey: action.Set.key.length > 2 ? action.Set.key[action.Set.key.length - 1] : '',
                                color: categoryColor(action.Set.key[0] === 'data' ? action.Set.key[1] : action.Set.key[0]),
                                json: action.Set.value_as_json,
                                start_time: action.Set.start_time,
                                timeStorage: Math.floor((action.Set.end_time - action.Set.start_time) * 1000000),
                                timeProtocol: actionPreviousTimestamp !== 0 ?
                                    Math.floor((action.Set.start_time - actionPreviousTimestamp) * 1000000) : 0,
                            };
                            // save prev timestamp
                            actionPreviousTimestamp = action.Set.end_time;
                            return {
                                ...accum,
                                [result.start_time]: result
                            }
                        }


                        if (action.hasOwnProperty('Get')) {
                            const result = {
                                ...action.Get,
                                type: 'GET',
                                key: parseKey(action.Get.key),
                                category: action.Get.key[0] === 'data' ? action.Get.key[1] : action.Get.key[0],
                                address: action.Get.key[1] === 'contracts' ? bytes2address(action.Get.key[9]) : '',
                                lastKey: action.Get.key.length > 2 ? action.Get.key[action.Get.key.length - 1] : '',
                                color: categoryColor(action.Get.key[0] === 'data' ? action.Get.key[1] : action.Get.key[0]),
                                start_time: action.Get.start_time,
                                timeStorage: Math.floor((action.Get.end_time - action.Get.start_time) * 1000000),
                                timeProtocol: actionPreviousTimestamp !== 0 ?
                                    Math.floor((action.Get.start_time - actionPreviousTimestamp) * 1000000) : 0,
                            };
                            // save prev timestamp
                            actionPreviousTimestamp = action.Get.end_time;
                            return {
                                ...accum,
                                [result.start_time]: result
                            }
                        }

                        if (action.hasOwnProperty('Mem')) {
                            const result = {
                                ...action.Mem,
                                type: 'MEM',
                                key: parseKey(action.Mem.key),
                                category: action.Mem.key[0] === 'data' ? action.Mem.key[1] : action.Mem.key[0],
                                address: action.Mem.key[1] === 'contracts' ? bytes2address(action.Mem.key[9]) : '',
                                lastKey: action.Mem.key.length > 2 ? action.Mem.key[action.Mem.key.length - 1] : '',
                                color: categoryColor(action.Mem.key[0] === 'data' ? action.Mem.key[1] : action.Mem.key[0]),
                                start_time: action.Mem.start_time,
                                timeStorage: Math.floor((action.Mem.end_time - action.Mem.start_time) * 1000000),
                                timeProtocol: actionPreviousTimestamp !== 0 ?
                                    Math.floor((action.Mem.start_time - actionPreviousTimestamp) * 1000000) : 0,
                            };
                            // save prev timestamp
                            actionPreviousTimestamp = action.Mem.end_time;
                            return {
                                ...accum,
                                [result.start_time]: result
                            }
                        }


                        if (action.hasOwnProperty('DirMem')) {
                            const result = {
                                ...action.DirMem,
                                type: 'DMEM',
                                key: parseKey(action.DirMem.key),
                                category: action.DirMem.key[0] === 'data' ? action.DirMem.key[1] : action.DirMem.key[0],
                                address: action.DirMem.key[1] === 'contracts' ? bytes2address(action.DirMem.key[9]) : '',
                                lastKey: action.DirMem.key.length > 2 ? action.DirMem.key[action.DirMem.key.length - 1] : '',
                                color: categoryColor(action.DirMem.key[0] === 'data' ? action.DirMem.key[1] : action.DirMem.key[0]),
                                start_time: action.DirMem.start_time,
                                timeStorage: Math.floor((action.DirMem.end_time - action.DirMem.start_time) * 1000000),
                                timeProtocol: actionPreviousTimestamp !== 0 ?
                                    Math.floor((action.DirMem.start_time - actionPreviousTimestamp) * 1000000) : 0,
                            };
                            // save prev timestamp
                            actionPreviousTimestamp = action.DirMem.end_time;
                            return {
                                ...accum,
                                [result.start_time]: result
                            }
                        }

                        if (action.hasOwnProperty('Delete')) {
                            return {
                                ...accum,
                                [action.Delete.start_time]: {
                                    type: 'DEL',
                                    ...action.Delete
                                }
                            }
                        }

                        if (action.hasOwnProperty('RemoveRecord')) {
                            return {
                                ...accum,
                                [action.RemoveRecord.start_time]: {
                                    type: 'REM',
                                    ...action.RemoveRecord
                                }
                            }
                        }

                        return accum;
                    }, {})
            }

            // // total time for storage time
            // let totalTimeStorage = result.entities.reduce((acc, value) => {
            //     return (acc + value.timeStorage);
            // }, 0);

            // // total time for protocol
            // let totalTimeProtocol = result.entities.reduce((acc, value) => {
            //     return (acc + value.timeProtocol);
            // }, 0);

            // console.log('[PROFILER] Storage: ' + totalTimeStorage / 1000 + 'ms  Protocol: ' + totalTimeProtocol / 1000 + 'ms');

            return result
        }

        default:
            return state;
    }
}

export function parseKey(inputKey) {

    let key = JSON.parse(JSON.stringify(inputKey));

    // process block priority
    if ((key.indexOf('block_priority') > 0)) {
        key = key.filter((value, index) => {
            return (index > 2) ? true : false;
        });
    }

    // process contract
    if ((key.indexOf('contracts') > 0) && (key.indexOf('index') > 0)) {
        key = key
            .filter((value, index) => {
                // remove index from path
                return (index > 8) ? true : false;
            }).map((value, index) => {

                if (index === 0) {
                    return bytes2address(value);
                }
                return value;
            });
    }


    // process contract
    if ((key.indexOf('contracts') > 0) && (key.indexOf('global_counter') > 0)) {
        key = key
            .filter((value, index) => {
                return (index > 1) ? true : false;
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

    // process big_map
    if ((key.indexOf('big_maps') > 0)) {
        key = key.filter((value, index) => {
            return ((index > 8 && index < 11) || (index > 15)) ? true : false;
        });
    }

    // process cycle
    if ((key.indexOf('cycle') > 0)) {
        key = key.filter((value, index) => {
            return (index > 1) ? true : false;
        });
    }

    // process rolls
    if ((key.indexOf('rolls') > 0)) {
        key = key.filter((value, index) => {
            return (index > 1) ? true : false;
        });
    }

    // process votes
    if ((key.indexOf('votes') > 0)) {
        key = key.filter((value, index) => {
            return (index > 1) ? true : false;
        });
    }

    // process protocol
    if ((key.indexOf('protocol') > 0)) {
        key = key.filter((value, index) => {
            return (index > 0) ? true : false;
        });
    }

    // process version
    if ((key.indexOf('version') > 0)) {
        key = key.filter((value, index) => {
            return (index > 1) ? true : false;
        });
    }

    // process v1
    if ((key.indexOf('v1') > 0)) {
        key = key.filter((value, index) => {
            return (index > 1) ? true : false;
        });
    }

    // remove last element
    key.pop();

    // replace , with /
    return key.length > 0 ? '/' + key.toString().replace(/,/g, '/') : '';
}

export function categoryColor(category) {
    switch (category) {
        case 'active_delegates_with_rolls': {
            return 'blue';
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
            return 'green';
        }
        case 'delegates': {
            return 'red';
        }
        case 'delegates_with_frozen_balance': {
            return 'blue';
        }
        case 'ramp_up': {
            return 'yellow';
        }
        case 'rolls': {
            return 'gray';
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
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'delegate_desactivation'], 'Cycle_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'frozen_balance', '*', 'rewards'], 'Tez_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'frozen_balance', '*', 'deposits'], 'Tez_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'frozen_balance', '*', 'fees'], 'Tez_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'balance'], 'Tez_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'change'], 'Tez_repr'],

        [['data', 'delegates_with_frozen_balance', '*', '*', '*', '*', '*', '*', '*', '*'], 'String_repr'],
        [['data', 'active_delegates_with_rolls', '*', '*', '*', '*', '*', '*', '*'], 'String_repr'],
        [['data', 'block_priority'], 'empty_repr'],

        [['data', 'contracts', 'global_counter'], 'Z_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'counter'], 'Z_repr'],
        [['data', 'contracts', 'index', '*', '*', '*', '*', '*', '*', '*', 'manager'], 'Manager_repr'],
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

    // TODO: uncoment to find not hadled cases
    // if (!isEncoding) {
    //     console.log('[encoding]', encoding, key, value);
    // }

    // call encoding function
    switch (encoding) {
        case 'Tez_repr': return Tez_repr(value);
        case 'Cycle_repr': return Cycle_repr(value);
        case 'Manager_repr': return Manager_repr(value);
        case 'String_repr': return String_repr(value);
        case 'Z_repr': return Z_repr(value);
        default: return false;
    }
}

export function Tez_repr(value) {
    const hexValue = bufferToHex(new Uint8Array(value));
    // zarith number
    return (zarithDecode(hexValue) / 1000000) + '';
}

// url to validate result
// https://alphanet.simplestaking.com:3000/chains/main/blocks/BMSVcRKJriyu49ug6zXQaajbwMDLSYCeZKuA11ZD6rakUwBSE7p/context/contracts/tz1efSQdjbTut8NyqE6VEj6CcyRP5mL97SNi
export function Cycle_repr(value) {

    const buffer = new Buffer(value);
    const int32 = buffer.readUIntBE(0, 4);

    // console.log('[Cycle_repr]', value, result);
    // 4 bytes to int32
    return int32 + '';
}

export function Z_repr(value) {
    const hexValue = bufferToHex(new Uint8Array(value));
    // zarith number
    return (zarithDecode(hexValue) / 2);
}

export function Manager_repr(valueBytes) {

    const value = bufferToHex(new Uint8Array(valueBytes));
    // convert contract hex to string
    let addressPrefix = new Uint8Array();
    let address = '';
    if (value.substring(0, 4) === '0000') { addressPrefix = prefix.tz1; address = value.substr(4); }
    if (value.substring(0, 4) === '0001') { addressPrefix = prefix.tz2; address = value.substr(4); }
    if (value.substring(0, 4) === '0002') { addressPrefix = prefix.tz3; address = value.substr(4); }
    if (value.substring(0, 2) === '01') { addressPrefix = prefix.KT1; address = value.substr(2, value.length - 4); }

    const hash = bs58checkEncode(addressPrefix, Buffer.from(address, 'hex'));
    return value;

}

export function String_repr(valueBytes) {

    return new TextDecoder('utf-8').decode(new Uint8Array(valueBytes));

}

export function Block_repr(valueBytes) {

    const value = bufferToHex(new Uint8Array(valueBytes));
    // convert contract hex to string
    const hash = bs58checkEncode(prefix.B, new Uint8Array(valueBytes));
    return hash;

}



export function bytes2address(value) {
    if (!value) return '';
    // convert contract hex to string
    let addressPrefix = new Uint8Array();
    let address = '';
    if (value.substring(0, 4) === '0000') { addressPrefix = prefix.tz1; address = value.substr(4); }
    if (value.substring(0, 4) === '0001') { addressPrefix = prefix.tz2; address = value.substr(4); }
    if (value.substring(0, 4) === '0002') { addressPrefix = prefix.tz3; address = value.substr(4); }
    if (value.substring(0, 2) === '01') { addressPrefix = prefix.KT1; address = value.substr(2, value.length - 4); }

    const hash = bs58checkEncode(addressPrefix, Buffer.from(address, 'hex'));
    return hash
}