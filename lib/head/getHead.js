import { rpc } from "../common";
/**
 * Get head for operation
 */
export const head = () => (source) => source.pipe(
// get head
rpc((state) => ({
    url: '/chains/main/blocks/head',
    path: 'head',
})));
//# sourceMappingURL=getHead.js.map