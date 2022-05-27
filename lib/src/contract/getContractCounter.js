import { rpc } from "../common";
/**
 * Get contract counter
 *
 * @url /chains/main/blocks/head/context/contracts/[publicKeyHash]/counter
 */
export const counter = () => (source) => source.pipe(
// get counter for contract
rpc((state) => ({
    url: `/chains/main/blocks/head/context/contracts/${state.wallet.publicKeyHash}/counter`,
    path: 'counter',
})));
//# sourceMappingURL=getContractCounter.js.map