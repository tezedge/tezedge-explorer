import * as sodium from 'libsodium-wrappers';
import * as bs58check from 'bs58check';
import * as bip39 from 'bip39';
import { Buffer } from 'buffer';
/**
 * Prefix table
 */
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
/**
 * Encode byte array into base58check format using defined prefix
 * @param prefix
 * @param payload
 */
export function bs58checkEncode(prefix, payload) {
    const n = new Uint8Array(prefix.length + payload.length);
    n.set(prefix);
    n.set(payload, prefix.length);
    return bs58check.encode(Buffer.from(n));
}
/**
 * Decodes base58 encoded string into byte array and removes defined prefix
 * @param prefix
 * @param encoded
 */
export function base58CheckDecode(prefix, encoded) {
    return bs58check.decode(encoded).slice(prefix.length);
}
/**
 * Concat together private and public key
 * @param privateKey
 * @param publicKey
 */
export function concatKeys(privateKey, publicKey) {
    const concated = new Uint8Array(privateKey.length + publicKey.length);
    concated.set(privateKey);
    concated.set(publicKey, privateKey.length);
    return concated;
}
/**
 * Convert publicKeyHash to buffer
 * @param publicKeyHash
 * @param encoded
 */
export function publicKeyHash2buffer(publicKeyHash) {
    switch (publicKeyHash.substr(0, 3)) {
        case 'tz1':
            return {
                originated: 0,
                hash: concatKeys(new Uint8Array([0]), base58CheckDecode(prefix.tz1, publicKeyHash)),
            };
        case 'tz2':
            return {
                originated: 0,
                hash: concatKeys(new Uint8Array([1]), base58CheckDecode(prefix.tz2, publicKeyHash)),
            };
        case 'tz3':
            return {
                originated: 0,
                hash: concatKeys(new Uint8Array([2]), base58CheckDecode(prefix.tz3, publicKeyHash)),
            };
        case 'KT1':
            return {
                originated: 1,
                hash: concatKeys(new Uint8Array([1]), concatKeys(base58CheckDecode(prefix.KT1, publicKeyHash), new Uint8Array([0]))),
            };
        default:
            throw new Error('Wrong Tezos publicKeyHash address');
    }
}
/**
 * Convert string amount notation into number in milions
 * @param amount text amount (3.50 tez)
 */
export function parseAmount(amount) {
    return amount === '0' ? 0 : Math.round(parseFloat(amount) * +1000000); // 1 000 000 = 1.00 tez
}
export function keys(mnemonic, password) {
    mnemonic = mnemonic ? mnemonic : bip39.generateMnemonic(160);
    password = mnemonic ? password : '';
    let seed = bip39.mnemonicToSeed(mnemonic, password).slice(0, 32);
    // ED25516 
    let keyPair = sodium.crypto_sign_seed_keypair(seed, 'uint8array');
    // remove publicKey
    let privateKey = keyPair.privateKey.slice(0, 32);
    return {
        mnemonic: mnemonic,
        secretKey: bs58checkEncode(prefix.edsk32, privateKey),
        publicKey: bs58checkEncode(prefix.edpk, keyPair.publicKey),
        publicKeyHash: bs58checkEncode(prefix.tz1, 
        // blake2b algo
        sodium.crypto_generichash(20, keyPair.publicKey))
    };
}
/**
 * Get sodium ready state
 */
export const ready = () => sodium.ready;
//# sourceMappingURL=crypto.js.map