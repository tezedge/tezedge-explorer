"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationIsValid = exports.validateOperationAtomic = exports.validateOperation = void 0;
const rxjs_1 = require("rxjs");
const common_1 = require("../common");
const operators_1 = require("rxjs/operators");
const signOperation_1 = require("./signOperation");
const forgeOperation_1 = require("./forgeOperation");
/**
 * Validates operation on node to ensure, that operation can be executed and prefills gas consumption and storage size data
 *
 * @throws ValidationError when validation can't succeed with error details
 */
exports.validateOperation = () => (source) => source.pipe(forgeOperation_1.forgeOperationInternal(), 
// add signature to state     
operators_1.flatMap(state => {
    if (state.wallet.type === 'TREZOR_T') {
        return signOperation_1.signOperationTrezor(state);
    }
    else {
        return signOperation_1.signOperation(state);
    }
}), exports.validateOperationAtomic(), operators_1.flatMap(state => {
    // update detailes of successfull operations
    state.validatedOperations.contents.
        filter(op => op.metadata.operation_result.status === "applied").
        forEach(validated => {
        // we asume here no batching!
        const operation = state.operations.find(op => op.kind === validated.kind);
        // modify values with simulation results
        if (operation) {
            // use estimated gas from node
            operation.gas_limit = validated.metadata.operation_result.consumed_gas;
            // add storage size to the expected storage consumption (e.g. origination has implicit consumption of 257)  
            operation.storage_limit = (parseInt(operation.storage_limit) + parseInt(validated.metadata.operation_result.storage_size || "0")).toString();
            // fee is not estimated here as we do not know operation byte size yet!
            // operation must be forged to find this out
            console.log('[+] Operation gas consumption set', operation);
        }
        else {
            // this should never happen...
            console.error("Update operation data failed. Cannot find operation", validated);
        }
    });
    if (state.validatedOperations.contents.every(operationIsValid)) {
        console.log("[+] all operations are valid");
        return rxjs_1.of(state);
    }
    else {
        const invalidOperations = state.validatedOperations.contents.filter(op => !operationIsValid(op));
        console.error("[+] some operation would not be accepted be node", invalidOperations);
        return rxjs_1.throwError({
            state,
            // flat map validation errors
            response: invalidOperations.map(op => op.metadata.operation_result.errors[0])
        });
    }
}));
/**
 * Serialize operation parameters on node
 *
 * @url /chains/main/blocks/head/helpers/scripts/pack_data
 */
exports.validateOperationAtomic = () => (source) => source.pipe(common_1.rpc((state) => {
    return {
        url: '/chains/main/blocks/head/helpers/scripts/run_operation',
        path: 'validatedOperations',
        payload: {
            branch: state.head.hash,
            contents: state.operations,
            signature: state.signOperation.signature
        }
    };
}));
function operationIsValid(operation) {
    return operation.metadata.operation_result.status === "applied";
}
exports.operationIsValid = operationIsValid;
//# sourceMappingURL=validateOperation.js.map