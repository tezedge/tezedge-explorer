import { Observable } from 'rxjs';
import { State, ValidationResult, OperationValidationResult } from '../common';
import { StateHead } from '../head';
import { StateOperations } from './operation';
import { StateSignOperation } from './signOperation';
export declare type StateValidatedOperations = {
    validatedOperations: ValidationResult;
};
/**
 * Validates operation on node to ensure, that operation can be executed and prefills gas consumption and storage size data
 *
 * @throws ValidationError when validation can't succeed with error details
 */
export declare const validateOperation: <T extends State & StateHead & StateOperations>() => (source: Observable<T>) => Observable<T & StateValidatedOperations>;
/**
 * Serialize operation parameters on node
 *
 * @url /chains/main/blocks/head/helpers/scripts/pack_data
 */
export declare const validateOperationAtomic: <T extends State & StateHead & StateOperations & StateSignOperation>() => (source: Observable<T>) => Observable<T & StateValidatedOperations>;
export declare function operationIsValid(operation: OperationValidationResult): boolean;
