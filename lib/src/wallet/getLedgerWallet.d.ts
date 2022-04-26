import { State } from '../common';
import { Observable } from 'rxjs';
import 'babel-polyfill';
import type Transport from '@ledgerhq/hw-transport';
export declare const getLedgerWallet: <T extends State>(selector: (params: State) => {
    transport: Transport | undefined;
}) => (source: Observable<any>) => Observable<State>;
