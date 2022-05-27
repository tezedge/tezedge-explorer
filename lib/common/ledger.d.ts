import 'babel-polyfill';
import type Transport from '@ledgerhq/hw-transport';
export declare type PublicKeyData = {
    publicKey: string;
    publicKeyHash: string;
};
export declare type LedgerState = {
    keys: PublicKeyData[];
    transportHolder?: {
        transport: Transport | undefined;
    };
};
export declare class LedgerUtils {
    private readonly prefix;
    private readonly DEFAULT_PATH;
    transport: Transport | undefined;
    getAddress(transportHolder: {
        transport: Transport | undefined;
    }): Promise<LedgerState>;
    requestLedgerSignature(op: string, transportHolder: {
        transport: Transport | undefined;
    }): Promise<string>;
    private getPublicAddress;
    private transportCheck;
    private setTransport;
    private signOperation;
    private static sanitize;
    private pk2pkh;
    private hex2pk;
    private hex2buf;
    private static buf2hex;
    private static b58checkEncode;
    private static b58checkDecode;
}
