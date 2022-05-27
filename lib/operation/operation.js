import { forgeOperation } from "./forgeOperation";
import { applyAndInjectOperation } from "./applyInjectOperation";
/**
 * Create operation in blockchain.
 * Fully forge operation, validates it and inject into blockchain
 */
export const operation = () => (source) => source.pipe(
// create operation
forgeOperation(), 
// apply & inject operation
applyAndInjectOperation());
//# sourceMappingURL=operation.js.map