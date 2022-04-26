import { rpc } from "../common";
/**
* Get manager key for contract
*/
export const managerKey = () => (source) => source.pipe(
// get manager key for contract 
rpc((state) => ({
    url: '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/manager_key',
    path: 'manager_key' // @TODO: should not be 'manager' ??
})));
//# sourceMappingURL=getContractManagerKey.js.map