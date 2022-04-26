"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constants = void 0;
const common_1 = require("../common");
/**
 * Get constants used in block
 *
 * @url "/chains/main/blocks/head/context/constants"
 */
exports.constants = () => (source) => source.pipe(
// get head
common_1.rpc((state) => ({
    url: '/chains/main/blocks/head/context/constants',
    path: 'constants',
})));
//# sourceMappingURL=getConstants.js.map