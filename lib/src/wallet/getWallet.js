import { rpc } from "../common";
/**
 * Get wallet details as balance
 *
 * @url /chains/main/blocks/head/context/contracts/[walletPublicKey]/
 */
export const getWallet = () => (source) => source.pipe(
// get contract info balance 
rpc(state => ({
    url: `/chains/main/blocks/head/context/contracts/${state.wallet.publicKeyHash}`,
    path: 'getWallet'
})));
//# sourceMappingURL=getWallet.js.map