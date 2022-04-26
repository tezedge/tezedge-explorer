var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'babel-polyfill';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import * as Bs58check from 'bs58check';
import { blake2b } from 'blakejs';
// @ts-ignore
import Tezos from '@obsidiansystems/hw-app-xtz';
export class LedgerUtils {
    constructor() {
        this.prefix = {
            tz1: new Uint8Array([6, 161, 159]),
            tz2: new Uint8Array([6, 161, 161]),
            tz3: new Uint8Array([6, 161, 164]),
            edpk: new Uint8Array([13, 15, 37, 217]),
            sppk: new Uint8Array([3, 254, 226, 86]),
            edsk: new Uint8Array([43, 246, 78, 7]),
            spsk: new Uint8Array([17, 162, 224, 201]),
            edsig: new Uint8Array([9, 245, 205, 134, 18]),
            spsig: new Uint8Array([13, 115, 101, 19, 63]),
            sig: new Uint8Array([4, 130, 43]),
            o: new Uint8Array([5, 116]),
            B: new Uint8Array([1, 52]),
            TZ: new Uint8Array([3, 99, 29]),
            KT: new Uint8Array([2, 90, 121])
        };
        this.DEFAULT_PATH = '44\'/1729\'/0\'/0\'';
    }
    getAddress(transportHolder) {
        return __awaiter(this, void 0, void 0, function* () {
            const derivationPath = (derPath) => {
                const m = derPath.match(/^44'\/1729('\/[0-9]+)+'$/g);
                return !!(m || derPath === '44\'/1729\'');
            };
            const noResponse = {
                keys: [{ publicKey: undefined, publicKeyHash: undefined }],
                transport: undefined
            };
            const path = this.DEFAULT_PATH;
            if (derivationPath(path)) {
                try {
                    console.log(transportHolder);
                    const pk = yield this.getPublicAddress(path, transportHolder);
                    this.transport.close();
                    return {
                        keys: [
                            {
                                publicKey: pk,
                                publicKeyHash: this.pk2pkh(pk)
                            }
                        ],
                    };
                }
                catch (e) {
                    console.error(e);
                }
            }
            else {
                console.warn('Invalid derivation path');
            }
            return noResponse;
        });
    }
    requestLedgerSignature(op, transportHolder) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = yield this.signOperation('03' + op, transportHolder);
            this.transport.close();
            return signature;
        });
    }
    getPublicAddress(path, transportHolder) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.transportCheck();
            transportHolder.transport = this.transport;
            const xtz = new Tezos(this.transport);
            const result = yield xtz
                .getAddress(path, true)
                .then((res) => {
                return LedgerUtils.sanitize(res);
            })
                .catch((e) => {
                this.transport.close();
                transportHolder.transport = this.transport;
                throw e;
            });
            return this.hex2pk(result.publicKey);
        });
    }
    transportCheck() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.transport) {
                yield this.setTransport();
            }
            if (!this.transport) {
                throw new Error('NO_TRANSPORT_FOUND');
            }
        });
    }
    setTransport() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.transport) {
                try {
                    this.transport = yield TransportWebHID.create();
                    console.log('Transport is now set to use WebHID!');
                }
                catch (e) {
                    this.transport = undefined;
                    console.warn('Couldn\'t set WebHID as transport!');
                    console.error(e);
                }
            }
            if (!this.transport) {
                // try {
                //     this.transport = yield import('@ledgerhq/hw-transport-node-hid')
                //         .then((module) => __awaiter(this, void 0, void 0, function* () {
                //         const TransportNodeHid = module.default;
                //         return yield TransportNodeHid.create();
                //     }));
                //     console.log('Transport is now set to use NodeHID!');
                // }
                // catch (e) {
                //     this.transport = undefined;
                //     console.warn('Couldn\'t set NodeHID as transport!');
                //     console.error(e);
                // }
            }
        });
    }
    signOperation(op, transportHolder) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!['03', '05'].includes(op.slice(0, 2))) {
                throw new Error('Invalid prefix');
            }
            yield this.transportCheck();
            const xtz = new Tezos(this.transport);
            const result = yield xtz
                .signOperation(this.DEFAULT_PATH, op)
                .then((res) => LedgerUtils.sanitize(res))
                .catch((e) => {
                this.transport.close();
                transportHolder.transport = this.transport;
                throw e;
            });
            return (result && result.signature) ? result.signature : '';
        });
    }
    static sanitize(res) {
        res = JSON.parse(JSON.stringify(res));
        if (res && res.publicKey && typeof res.publicKey !== 'string') {
            throw Error('Invalid PK');
        }
        if (res && res.signature && typeof res.signature !== 'string') {
            throw Error('Invalid signature');
        }
        return res;
    }
    pk2pkh(pk) {
        if (pk.length === 54 && pk.slice(0, 4) === 'edpk') {
            const pkDecoded = LedgerUtils.b58checkDecode(pk, this.prefix.edpk);
            const payload = blake2b(pkDecoded, undefined, 20);
            return LedgerUtils.b58checkEncode(payload, this.prefix.tz1);
        }
        throw new Error('Invalid public key');
    }
    hex2pk(hex) {
        return LedgerUtils.b58checkEncode(this.hex2buf(hex.slice(2, 66)), this.prefix.edpk);
    }
    hex2buf(hex) {
        return new Uint8Array(hex.match(/[\da-f]{2}/gi).map((h) => parseInt(h, 16)));
    }
    static buf2hex(buffer) {
        const byteArray = new Uint8Array(buffer);
        const hexParts = [];
        for (let i = 0; i < byteArray.length; i++) {
            const hex = byteArray[i].toString(16);
            const paddedHex = ('00' + hex).slice(-2);
            hexParts.push(paddedHex);
        }
        return hexParts.join('');
    }
    static b58checkEncode(payload, prefix) {
        if (prefix === undefined) {
            return '';
        }
        const n = new Uint8Array(prefix.length + payload.length);
        n.set(prefix);
        n.set(payload, prefix.length);
        return Bs58check.encode(Buffer.from(LedgerUtils.buf2hex(n), 'hex'));
    }
    static b58checkDecode(enc, prefix) {
        let n = Bs58check.decode(enc);
        n = n.slice(prefix.length);
        return n;
    }
}
//# sourceMappingURL=ledger.js.map
