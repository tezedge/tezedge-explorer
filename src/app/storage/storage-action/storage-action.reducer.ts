import * as bs58check from 'bs58check';
import {Buffer} from 'buffer';

const initialState: any = {
  ids: [],
  entities: [],
  lastCursorId: 0,
  stream: false,
  blocks: [],
  view: '',
  filters: []
  // filters: ['SET']
};


function bufferToHex(buffer) {
  return Array
    .from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function reducer(state = initialState, action) {
  switch (action.type) {

    case 'STORAGE_BLOCK_ACTION_LOAD': {
      return {
        ...initialState,
        view: 'block',
      };
    }

    case 'STORAGE_ADDRESS_ACTION_LOAD': {
      return {
        ...initialState,
        view: 'address',
      };
    }

    case 'STORAGE_BLOCK_ACTION_LOAD_SUCCESS': {
      return {
        ...processActions(state, action),
        view: 'block',
      };
    }

    case 'STORAGE_ADDRESS_ACTION_LOAD_SUCCESS': {
      return {
        ...processActions(state, action),
        view: 'address'
      };
    }

    case 'STORAGE_ACTION_FILTER': {
      console.log(action.payload);
      return {
        ...state,
        filters: [
          ...action.payload
        ]
      };
    }

    default:
      return state;
  }
}

export function processActions(state, action) {
  // clone action
  let _action = JSON.parse(JSON.stringify(action));
  _action.payload = _action.payload.map((item, index) => {
    return {
      ...item,
      originalId: item.id,
      id: index + 1
    };
  });

  // get time stamp
  // function get_time(localAction) {
  //   return localAction[propertyToUse].start_time;
  // }

  // sort actions by timestamp
  // _action.payload.sort((a, b) => {
  //   const aa = a[getPropertyToUse(a)].start_time;
  //   const bb = b[getPropertyToUse(b)].start_time;
  //   return aa - bb;
  // });
  _action.payload.sort((a, b) => {
    return a.id - b.id;
  });

  let actionPreviousTimestamp = 0;
  // console.log('[STORAGE_ACTION_LOAD_SUCCESS]', action.payload);
  const result = {
    ...state,
    blocks: _action.payload
      // .filter(action => action.hasOwnProperty('Set'))
      // .filter(action => action.hasOwnProperty('Delete'))
      .reduce((accum, action) => {
        const propertyToUse = getPropertyToUse(action);

        if (propertyToUse) {
          const blockHash = Block_repr(action[propertyToUse].block_hash);
          return accum.indexOf(blockHash) !== -1 ?
            accum :
            [
              ...accum,
              blockHash
            ];
        } else {
          return accum;
        }
      }, []).reverse(),

    ids: _action.payload
      .map(item => item.id)
      .sort((a, b) => a - b),
    // .reduce((accum, action) => {
    //   const propertyToUse = getPropertyToUse(action);
    //
    //   if (propertyToUse) {
    //     const blockHash = Block_repr(action[propertyToUse].block_hash);
    //     const blockActions = accum[blockHash] ? accum[blockHash] : [];
    //     return {
    //       ...accum,
    //       [blockHash]: [
    //         ...blockActions,
    //         action.id
    //         // action[propertyToUse].start_time
    //       ]
    //     };
    //   } else {
    //     return accum;
    //   }
    // }, []),

    entities: _action.payload
      // show only set operations
      // .filter(action => action.hasOwnProperty('Set'))
      // .filter(action => action.hasOwnProperty('Delete'))
      .reduce((accum, action) => {
        const propertyToUse = getPropertyToUse(action);

        if (propertyToUse) {
          const generalResult = {
            ...action[propertyToUse],
            id: action.id,
            type: setType(action),
            key: action[propertyToUse].key ? parseKey(action[propertyToUse].key) : '',
            path: action[propertyToUse].key ? parsePath(action[propertyToUse].key) : '',
            // text: new TextDecoder('utf-8').decode(new Uint8Array(action.Set.value)),
            category: action[propertyToUse].key ?
              action[propertyToUse].key[0] === 'data' ? action[propertyToUse].key[1] ? action[propertyToUse].key[1] : '' : action[propertyToUse].key[0] : '',
            address: action[propertyToUse].key ?
              action[propertyToUse].key[1] === 'contracts' ? action[propertyToUse].key[9] ? bytes2address(action[propertyToUse].key[9]) : '' : '' : '',
            lastKey: action[propertyToUse].key ? action[propertyToUse].key.length > 2 ? action[propertyToUse].key[action[propertyToUse].key.length - 1] : '' : '',
            color: action[propertyToUse].key ? categoryColor(action[propertyToUse].key[0] === 'data' ? action[propertyToUse].key[1] : action[propertyToUse].key[0]) : 'gray',
            start_time: action[propertyToUse].start_time || 0,
            timeStorage: Math.floor((action[propertyToUse].end_time - action[propertyToUse].start_time) * 1000000) || 0,
            timeProtocol: actionPreviousTimestamp !== 0 ?
              Math.floor((action[propertyToUse].start_time - actionPreviousTimestamp) * 1000000) : 0,
            value_as_json: action[propertyToUse].value_as_json ? JSON.parse((action[propertyToUse].value_as_json)) : null
          };

          if (propertyToUse === 'Set') {
            generalResult.value = parseValue(action[propertyToUse].key, action[propertyToUse].value);
            generalResult.hex = '0x' + bufferToHex(new Uint8Array(action[propertyToUse].value));
            generalResult.json = action[propertyToUse].value_as_json || '';
          }
          // save prev timestamp
          actionPreviousTimestamp = action[propertyToUse].end_time; // TODO: ask if should be set only for Set, Get, Mem, DirMem; on the old implementation, it was like that

          return {
            ...accum,
            [action.id]: generalResult
          };

        } else {
          return accum;
        }
      }, {}),
    lastCursorId: setLastCursorId(_action, state)
  };

  // total time for storage time
  const totalTimeStorage = Object.keys(result.entities).reduce((acc, value) => {
    return (acc + result.entities[value].timeStorage);
  }, 0);

  // total time for protocol
  const totalTimeProtocol = Object.keys(result.entities).reduce((acc, value) => {
    return (acc + result.entities[value].timeProtocol);
  }, 0);

  console.log('[PROFILER] Storage: ' + totalTimeStorage / 1000 + 'ms  Protocol: ' + totalTimeProtocol / 1000 + 'ms');

  return {
    ...result,
    debug: {
      totalTimeStorage,
      totalTimeProtocol
    }
  };

}

export function setType(action): string {
  switch (true) {
    case action.hasOwnProperty('Set'):
      return 'SET';
    case action.hasOwnProperty('Delete'):
      return 'DELETE';
    case action.hasOwnProperty('RemoveRecursively'):
      return 'REMOVE RECURSIVELY';
    case action.hasOwnProperty('Copy'):
      return 'COPY';
    case action.hasOwnProperty('Checkout'):
      return 'CHECKOUT';
    case action.hasOwnProperty('Commit'):
      return 'COMMIT';
    case action.hasOwnProperty('Mem'):
      return 'MEM';
    case action.hasOwnProperty('DirMem'):
      return 'DIR MEM';
    case action.hasOwnProperty('Get'):
      return 'GET';
    case action.hasOwnProperty('Fold'):
      return 'FOLD';
    case action.hasOwnProperty('RemoveRecord'):
      return 'REMOVE RECORD';
    default:
      return '';
  }
}

export function getPropertyToUse(action): string {
  switch (true) {
    case action.hasOwnProperty('Set'):
      return 'Set';
    case action.hasOwnProperty('Delete'):
      return 'Delete';
    case action.hasOwnProperty('RemoveRecursively'):
      return 'RemoveRecursively';
    case action.hasOwnProperty('Copy'):
      return 'Copy';
    case action.hasOwnProperty('Checkout'):
      return 'Checkout';
    case action.hasOwnProperty('Commit'):
      return 'Commit';
    case action.hasOwnProperty('Mem'):
      return 'Mem';
    case action.hasOwnProperty('DirMem'):
      return 'DirMem';
    case action.hasOwnProperty('Get'):
      return 'Get';
    case action.hasOwnProperty('Fold'):
      return 'Fold';
    case action.hasOwnProperty('RemoveRecord'):
      return 'RemoveRecord';
    default:
      return '';
  }
}

export function parseKey(inputKey) {
  if (!inputKey) {
    return '';
  }
  const key = JSON.parse(JSON.stringify(inputKey));
  return key.length > 0 ? '/' + key.toString().replace(/,/g, '/') : '';
}

export function parsePath(inputKey) {
  if (inputKey) {
    return '';
  }

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
      });
  }

  // process delegates_with_frozen_balance
  if ((key.indexOf('delegates_with_frozen_balance') > 0)) {
    key = key
      .filter((value, index) => {
        return ((index > 1 && index < 4) || index > 8) ? true : false;
      }).map((value, index) => {
        return value;
      });
  }

  // process active_delegates_with_rolls
  if ((key.indexOf('active_delegates_with_rolls') > 0)) {
    key = key.filter((value, index) => {
      return ((index > 1 && index < 3) || index > 7) ? true : false;
    });
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
    case 'active_delegates_with_rolls':
    case 'contracts':
    case 'delegates_with_frozen_balance': {
      return 'darkorange';
    }
    case 'big_maps':
    case 'block_priority':
    case 'cycle': {
      return 'green';
    }
    case 'commitments': {
      return 'red';
    }
    case 'delegates': {
      return 'red';
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
      return 'gray';
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
};

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

    // check every key from encoding path
    const match = code[0].every((item, index) => {
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
    case 'Tez_repr':
      return Tez_repr(value);
    case 'Cycle_repr':
      return Cycle_repr(value);
    case 'Manager_repr':
      return Manager_repr(value);
    case 'String_repr':
      return String_repr(value);
    case 'Z_repr':
      return Z_repr(value);
    default:
      return false;
  }
}

export function Tez_repr(value) {
  if (!value) {
    return '';
  }
  const hexValue = bufferToHex(new Uint8Array(value));
  // zarith number
  return (zarithDecode(hexValue) / 1000000) + '';
}

// url to validate result
// https://alphanet.simplestaking.com:3000/chains/main/blocks/BMSVcRKJriyu49ug6zXQaajbwMDLSYCeZKuA11ZD6rakUwBSE7p/context/contracts/tz1efSQdjbTut8NyqE6VEj6CcyRP5mL97SNi
export function Cycle_repr(value) {
  if (!value) {
    return '';
  }
  const buffer = new Buffer(value);
  const int32 = buffer.readUIntBE(0, 4);

  // console.log('[Cycle_repr]', value, result);
  // 4 bytes to int32
  return int32 + '';
}

export function Z_repr(value) {
  if (!value) {
    return '';
  }
  const hexValue = bufferToHex(new Uint8Array(value));
  // zarith number
  return (zarithDecode(hexValue) / 2);
}

export function Manager_repr(valueBytes) {
  if (!valueBytes) {
    return '';
  }

  const value = bufferToHex(new Uint8Array(valueBytes));
  // convert contract hex to string
  let addressPrefix = new Uint8Array();
  let address = '';
  if (value.substring(0, 4) === '0000') {
    addressPrefix = prefix.tz1;
    address = value.substr(4);
  }
  if (value.substring(0, 4) === '0001') {
    addressPrefix = prefix.tz2;
    address = value.substr(4);
  }
  if (value.substring(0, 4) === '0002') {
    addressPrefix = prefix.tz3;
    address = value.substr(4);
  }
  if (value.substring(0, 2) === '01') {
    addressPrefix = prefix.KT1;
    address = value.substr(2, value.length - 4);
  }

  const hash = bs58checkEncode(addressPrefix, Buffer.from(address, 'hex'));
  return value;

}

export function String_repr(valueBytes) {
  if (!valueBytes) {
    return '';
  }

  return new TextDecoder('utf-8').decode(new Uint8Array(valueBytes));
}

export function Block_repr(valueBytes) {
  if (!valueBytes) {
    return '';
  }

  const value = bufferToHex(new Uint8Array(valueBytes));
  // convert contract hex to string
  const hash = bs58checkEncode(prefix.B, new Uint8Array(valueBytes));
  return hash;

}

export function bytes2address(value) {
  if (!value) {
    return '';
  }
  // convert contract hex to string
  let addressPrefix = new Uint8Array();
  let address = '';
  if (value.substring(0, 4) === '0000') {
    addressPrefix = prefix.tz1;
    address = value.substr(4);
  }
  if (value.substring(0, 4) === '0001') {
    addressPrefix = prefix.tz2;
    address = value.substr(4);
  }
  if (value.substring(0, 4) === '0002') {
    addressPrefix = prefix.tz3;
    address = value.substr(4);
  }
  if (value.substring(0, 2) === '01') {
    addressPrefix = prefix.KT1;
    address = value.substr(2, value.length - 4);
  }

  const hash = bs58checkEncode(addressPrefix, Buffer.from(address, 'hex'));
  return hash;
}

export function setLastCursorId(action, state) {
  return action.payload.length > 0 && state.lastCursorId < action.payload[action.payload.length - 1].id ?
    action.payload[action.payload.length - 1].id : state.lastCursorId;
}
