import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Config, initializeWallet, transaction } from 'tezos-wallet';
import { of, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import Tezos from '@obsidiansystems/hw-app-xtz';
import { blake2b } from 'blakejs';

import * as bs58check from 'bs58check';
import { Buffer } from 'buffer';
import { LedgerService } from '@app/demo/ledger.service';
import { OperationService } from '@app/demo/operation.service';

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
  browser = 'unknown';
  defaultPath = '44\'/1729\'/0\'/0\'';
  defaultText = 'Default derivation path';
  path: string;
  pendingLedgerConfirmation = false;
  isHDDerivationPathCustom = false;

  constructor(private cdRef: ChangeDetectorRef,
              private operationService: OperationService,
              private ledgerService: LedgerService) { }

  ngOnInit(): void {
    this.path = this.defaultText;
    this.checkBrowser();
  }

  checkBrowser(): void {
    try {
      if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        this.browser = 'firefox';
      } else if ((navigator as any)?.userAgentData?.brands?.some((b) => b.brand === 'Google Chrome' || 'Chromium')) {
        this.browser = 'chromium';
      } else if ((navigator as any)?.userAgent.toLowerCase().indexOf('safari') > -1 && navigator.platform.indexOf('Mac') === -1) {
        this.browser = 'safari';
      }
    } catch (e) {
      console.warn(e);
    }
  }

  execute() {

// wallet used to create transaction with small tez amount
    const wallet: Config = {

      // secretKey: 'edsk3hEtniBGLP2wqYnc1Lix1hhV74eEenRBTfxjHTRHP59R7BapMW',
      // publicKey: 'edpkth42B7j7rvLeZWmufj28a7sEdbMBb9y16qgQmGHYGX4hPis9V4',
      // publicKeyHash: 'tz1WCojrEZWrjenejUZmG8QNsMtKPELx2TFA',

      secretKey: 'edsk48vvey4bjEQjmJ16iFun9tLKs3A5Qmx5iTida3fakpqSVw1qLQ',
      publicKey: 'edpkvPepgUwmic1rNCnHqe4kht8R5mbMLDBRHVWP5d19nmUbYQv9gy',
      publicKeyHash: 'tz1YqZPuie4xLmFakAYHKRwgQMLsA4BCRkpu',

      node: {
        name: 'testnet',
        display: 'Testnet',
        url: 'http://116.202.128.230:18732',
        tzstats: {
          url: 'http://116.202.128.230:18732/account/'
        }
      },
      type: 'web',
    };

    const walletObservable = of([]);

    walletObservable.pipe(
      // wait for sodium to initialize
      initializeWallet(stateWallet => ({
        secretKey: wallet.secretKey,
        publicKey: wallet.publicKey,
        publicKeyHash: wallet.publicKeyHash,
        // set Tezos node
        node: wallet.node,
        // set wallet type: WEB, TREZOR_ONE, TREZOR_T
        type: wallet.type,
      })),

      // generate new tezos wallet with keys
      // newWallet(),

      // originate contract
      transaction(stateWallet => ({
        to: 'tz1fm6a28VahUmoGkRV2RwuBMhtYNztkrtJy',
        // to: stateWallet.newWallet ? stateWallet.newWallet.publicKeyHash : 'tz1N4wqm7mqCFECjh8HUNHLyxfL73ay981LH',
        amount: '10',
        fee: '0.01'
      })),


      tap(data => console.log('[+] ok')),
      catchError(err => {
        console.error('[-] error', err);
        return throwError(err);
      })
    ).subscribe();

  }

  transport: any;

  async start() {
    const path: string = this.path.replace(this.defaultText, this.defaultPath);
    if (this.derivationPath(path)) {
      this.pendingLedgerConfirmation = true;
      try {
        const pk = await this.ledgerService.getPublicAddress(path);
        console.log('getPK => ' + pk);
        await this.importFromPk(pk, path);
      } catch (e) {
        throw e;
      } finally {
        this.pendingLedgerConfirmation = false;
      }
    } else {
      console.warn('Invalid derivation path');
    }
  }

  async importFromPk(pk: string, path: string): Promise<void> {
    console.log('derivationPath path:', path);
    await this.addImplicitAccount(pk, path);
  }

  addImplicitAccount(pk: string, derivationPath?: string | number) {
    let pkh;
    console.log(123123123);
    if (pk && pk.slice(0, 4) === 'sppk') {
      pkh = this.operationService.pk2pkh(pk);
    } else {
      this.publicKey = pk;
      this.publicKeyHash = this.pk2pkh(this.publicKey);
      this.cdRef.detectChanges();
      pkh = this.operationService.pk2pkh(pk);
    }
    if (pkh) {
      console.log('pkh: ', pkh);
      // this.wallet.implicitAccounts.push(new ImplicitAccount(pkh, pk, typeof derivationPath === 'number' ? `44'/1729'/${derivationPath}'/0'` : derivationPath));
      // console.log('Adding new implicit account...');
      // console.log(this.wallet.implicitAccounts[this.wallet.implicitAccounts.length - 1]);
      // this.storeWallet();
    }
  }

  derivationPath(path: string): Boolean {
    const m = path.match(/^44\'\/1729(\'\/[0-9]+)+\'$/g);
    if (m || path === '44\'/1729\'') {
      return true;
    }
    return false;
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
