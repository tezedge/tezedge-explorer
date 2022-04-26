import { rpc } from "../common";
/**
 * Get constants used in block
 *
 * @url "/chains/main/blocks/head/context/constants"
 */
export const constants = () => (source) => source.pipe(
// get head
rpc((state) => ({
    url: '/chains/main/blocks/head/context/constants',
    path: 'constants',
})));
//# sourceMappingURL=getConstants.js.map