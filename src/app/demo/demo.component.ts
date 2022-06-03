import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import Tezos from '@obsidiansystems/hw-app-xtz';
import { blake2b } from 'blakejs';

import * as bs58check from 'bs58check';
import { Buffer } from 'buffer';
import { LedgerService } from '@app/demo/ledger.service';
import { OperationService } from '@app/demo/operation.service';
import { webSocket } from 'rxjs/webSocket';
// import { getLedgerWallet, signLedgerOperation } from '../../../lib';

// import { Config, initializeWallet, transaction, getLedgerWallet } from '../../../lib';


@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoComponent implements OnInit {

  prefix = {
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
  publicKey = '';
  publicKeyHash = '';
  signature = '';
  browser = 'unknown';
  defaultPath = '44\'/1729\'/0\'/0\'';
  defaultText = 'Default derivation path';
  path: string = this.defaultText;
  pendingLedgerConfirmation = false;
  isHDDerivationPathCustom = false;

  constructor(private cdRef: ChangeDetectorRef,
              private operationService: OperationService,
              private ledgerService: LedgerService) { }

  mega: { transport: any } = { transport: undefined };
  transport: any;

  ngOnInit(): void {
    const subject = webSocket({
      url: 'ws://116.202.128.230:4444/rpc',
      WebSocketCtor: WebSocket,
    });

    // subject.subscribe((data) => {
    //   console.log(data);
    // });

    subject.subscribe();
// Note that at least one consumer has to subscribe to the created subject - otherwise "nexted" values will be just buffered and not sent,
// since no connection was established!

    subject.next({
      jsonrpc: '2.0',
      method: 'getBlock',
      params: {
        chain_id: 'main',
        block_id: 'head'
      },
      id: 1,
    });

    // subject.complete(); // Closes the connection.
//     subject.error({ code: 4000, reason: 'I think our app just broke!' });
  }

  async start() {
    //
    // console.log('[+] tezos-wallet client');
    // const ledgerObservable = of({});
    // console.log('sending transport:', JSON.stringify(this.transport));
    // ledgerObservable.pipe(
    //   getLedgerWallet(() => this.mega),
    //   tap((state: any) => {
    //     console.log('state');
    //     console.log(state);
    //     console.log('state');
    //     // console.log(JSON.stringify(state.ledger.keys));
    //     // console.log(JSON.stringify(state.ledger.transport));
    //     // this.publicKey = state.ledger.keys[0].publicKey;
    //     // this.publicKeyHash = state.ledger.keys[0].publicKeyHash;
    //     // this.transport = state.ledger.transport;
    //     this.cdRef.detectChanges();
    //   })
    // ).subscribe(
    //   data => console.log('[+] ok'),
    //   error => console.error('[-] error', error)
    // );
    // console.log(JSON.stringify(this.mega));
    // try {
    // } catch (e) {
    // this.mega.transport = pk.transport;
    // }
    // const pk = await new LedgerUtils().getAddress(this.mega);
    // console.log(pk);
    // this.cdRef.detectChanges();

    // // const path: string = this.defaultPath;
    // // if (this.derivationPath(path)) {
    // //   try {
    //     const pk = await new LedgerUtils().getAddress(this.transport);
    //     this.transport = pk.transport;
    //     console.log('getPK => ' + pk);
    //     // this.publicKey = pk;
    //     // this.publicKeyHash = this.pk2pkh(this.publicKey);
    //     this.cdRef.detectChanges();
    //   // } catch (e) {
    //   //   throw e;
    //   // }
    // // } else {
    // //   console.warn('Invalid derivation path');
    // // }
  }

  execute() {
//
// // wallet used to create transaction with small tez amount
//     const wallet: Config = {
//
//       // secretKey: 'edsk48vvey4bjEQjmJ16iFun9tLKs3A5Qmx5iTida3fakpqSVw1qLQ',
//       // publicKey: 'edpkvPepgUwmic1rNCnHqe4kht8R5mbMLDBRHVWP5d19nmUbYQv9gy',
//       // publicKeyHash: 'tz1YqZPuie4xLmFakAYHKRwgQMLsA4BCRkpu',
//
//       secretKey: '',
//       publicKey: 'edpkvZCHFVcXpBTVpD3ZANuZ7mPTfs62TUzcmpjTr1ZYhwaZdf3fer',
//       publicKeyHash: 'tz1fm6a28VahUmoGkRV2RwuBMhtYNztkrtJy',
//
//       node: {
//         name: 'testnet',
//         display: 'Testnet',
//         url: 'http://116.202.128.230:18732',
//         tzstats: {
//           url: 'http://116.202.128.230:18732/account/'
//         }
//       },
//       type: 'LEDGER',
//     };
//
//     const walletObservable = of([]);
//
//     walletObservable.pipe(
//       // wait for sodium to initialize
//       initializeWallet(stateWallet => ({
//         secretKey: wallet.secretKey,
//         publicKey: wallet.publicKey,
//         publicKeyHash: wallet.publicKeyHash,
//         // set Tezos node
//         node: wallet.node,
//         // set wallet type: WEB, TREZOR_ONE, TREZOR_T
//         type: wallet.type,
//       })),
//
//       // generate new tezos wallet with keys
//       // newWallet(),
//
//       // originate contract
//       transaction(stateWallet => [
//         {
//           to: 'tz1YqZPuie4xLmFakAYHKRwgQMLsA4BCRkpu',
//           // to: stateWallet.newWallet ? stateWallet.newWallet.publicKeyHash : 'tz1N4wqm7mqCFECjh8HUNHLyxfL73ay981LH',
//           amount: '0.9',
//           fee: '0.02'
//         },
//         // {
//         //   to: 'tz1YqZPuie4xLmFakAYHKRwgQMLsA4BCRkpu',
//         //   // to: stateWallet.newWallet ? stateWallet.newWallet.publicKeyHash : 'tz1N4wqm7mqCFECjh8HUNHLyxfL73ay981LH',
//         //   amount: '0.9',
//         //   fee: '0.01'
//         // },
//         // {
//         //   to: 'tz1ituzNz9MGaMSL9dVDN7jE5SArCEWNmZbS',
//         //   // to: stateWallet.newWallet ? stateWallet.newWallet.publicKeyHash : 'tz1N4wqm7mqCFECjh8HUNHLyxfL73ay981LH',
//         //   amount: '0.8',
//         //   fee: '0.01'
//         // },
//       ]),
//
//
//       tap(data => console.log('[+] ok')),
//       catchError(err => {
//         console.error('[-] error', err);
//         return throwError(err);
//       })
//     ).subscribe();

  }

  async signTransaction() {
    this.signature = '';
    // const state = {
    //   operation: '80e12752f5ee7e63c8c7c09e2e4088136b69dc638931c4221e376cc302eea76a6c0090c7d7304c93cbacecc7dbc06d233efc6b032ea0904e8ad3f904d08603810290a10f0000dcb8aa0d953c0a1a64f0e6b4bd9a670f8b4fa41c00',
    //   ledger: {
    //     transportHolder: {
    //       transport: undefined
    //     }
    //   }
    // } as any;
    // signLedgerOperation(state).pipe(
    //   tap((response: any) => {
    //     console.log(JSON.stringify(response));
    //     this.signature = response.signOperation.signature;
    //     this.cdRef.detectChanges();
    //   }),
    // ).subscribe(
    //   data => console.log('[+] ok'),
    //   error => console.error('[-] error', error),
    // );

    // const operation = '80e12752f5ee7e63c8c7c09e2e4088136b69dc638931c4221e376cc302eea76a6c0090c7d7304c93cbacecc7dbc06d233efc6b032ea0904e8ad3f904d08603810290a10f0000dcb8aa0d953c0a1a64f0e6b4bd9a670f8b4fa41c00';
    // this.signature = await new LedgerUtils().requestLedgerSignature('03' + operation, this.mega);
    // this.cdRef.detectChanges();
  }

  private derivationPath(path: string): boolean {
    const m = path.match(/^44\'\/1729(\'\/[0-9]+)+\'$/g);
    return !!(m || path === '44\'/1729\'');
  }

  async connect(): Promise<void> {
    if (!this.transport) {
      await this.setTransport();
    }
    if (!this.transport) {
      throw new Error('NO_TRANSPORT_FOUND');
    }
  }

  private async setTransport() {
    if (!this.transport) {
      console.log('Trying to use WebHID for transport...');
      try {
        this.transport = await TransportWebHID.create();
        console.log('Transport is now set to use WebHID!');
      } catch (e) {
        this.transport = null;
        console.warn('Couldn\'t set WebHID as transport!');
        console.error(e);
      }
    }
    if (!this.transport) {
      try {
        this.transport = await TransportWebUSB.create();
        console.warn('Transport is now set to use U2F!');
      } catch (e) {
        this.transport = null;
        console.log('Couldn\'t set U2F as transport!');
        console.error(e);
      }
    }
  }

  async logKeys(): Promise<void> {
    // console.log(await this.Tezos.signer.publicKey());

    const getAddress = async () => {
      const xtz = new Tezos(this.transport);
      const result = await xtz.getAddress('44\'/1729\'/0\'/0\'', true)
        .then((res) => {
          return this.sanitize(res, true);
        });

      this.publicKey = this.hex2pk(result.publicKey);
      this.publicKeyHash = this.pk2pkh(this.publicKey);
      this.cdRef.detectChanges();
      return this.publicKey;
    };
    console.log(await getAddress());
  }

  pk2pkh(pk: string): string {
    if (pk.length === 54 && pk.slice(0, 4) === 'edpk') {
      const pkDecoded = this.b58cdecode(pk, this.prefix.edpk);
      return this.b58cencode(blake2b(pkDecoded, null, 20), this.prefix.tz1);
    } else if (pk.length === 55 && pk.slice(0, 4) === 'sppk') {
      const pkDecoded = this.b58cdecode(pk, this.prefix.edpk);
      return this.b58cencode(blake2b(pkDecoded, null, 20), this.prefix.tz2);
    }
    throw new Error('Invalid public key');
  }

  hex2pk(hex: string) {
    return this.b58cencode(this.hex2buf(hex.slice(2, 66)), this.prefix.edpk);
  }

  b58cdecode(enc, prefixx): Buffer {
    let n = bs58check.decode(enc);
    n = n.slice(prefixx.length);
    return n;
  }

  b58cencode(payload: any, prefixx?: Uint8Array) {
    const n = new Uint8Array(prefixx.length + payload.length);
    n.set(prefixx);
    n.set(payload, prefixx.length);
    return bs58check.encode(Buffer.from(this.buf2hex(n), 'hex'));
  }

  hex2buf(hex) {
    return new Uint8Array(
      hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))
    );
  }

  buf2hex(buffer) {
    const byteArray = new Uint8Array(buffer);
    const hexParts = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < byteArray.length; i++) {
      const hex = byteArray[i].toString(16);
      const paddedHex = ('00' + hex).slice(-2);
      hexParts.push(paddedHex);
    }
    return hexParts.join('');
  }

  private sanitize(res: any, getPk: boolean) {
    res = JSON.parse(JSON.stringify(res));
    if (getPk && typeof res?.publicKey !== 'string') {
      throw Error('Invalid pk');
    }
    if (!getPk && typeof res?.signature !== 'string') {
      throw Error('Invalid signature');
    }
    return res;
  }
}
