import {
  SMART_CONTRACTS_DEBUG_STEP,
  SMART_CONTRACTS_GET_TRACE_SUCCESS,
  SMART_CONTRACTS_LOAD,
  SMART_CONTRACTS_LOAD_SUCCESS,
  SMART_CONTRACTS_RESET_BLOCKS,
  SMART_CONTRACTS_RUN,
  SMART_CONTRACTS_SET_ACTIVE_CONTRACT,
  SMART_CONTRACTS_SET_ACTIVE_CONTRACT_SUCCESS,
  SMART_CONTRACTS_START_DEBUGGING,
  SMART_CONTRACTS_STOP_DEBUGGING,
  SmartContractAction
} from '@smart-contracts/smart-contracts/smart-contracts.actions';
import { SmartContractTrace } from '@shared/types/smart-contracts/smart-contract-trace.type';
import { SmartContractsState } from '@smart-contracts/smart-contracts/smart-contracts.index';

const initialState: SmartContractsState = {
  contracts: [],
  activeContract: undefined,
  trace: undefined,
  gasTrace: [],
  isDebugging: false,
  debugConfig: {
    currentStep: null,
    stepIn: null,
    stepOut: null,
    nextStep: null,
    stepOver: null,
    previousStep: null
  },
  result: undefined,
  blockLevel: 0,
  blockHashContext: {
    hashes: [],
    activeIndex: 0
  },
};

export function reducer(state: SmartContractsState = initialState, action: SmartContractAction): SmartContractsState {

  switch (action.type) {

    case SMART_CONTRACTS_LOAD: {
      return {
        ...state,
        blockLevel: action.payload.blockLevel,
        blockHashContext: {
          ...state.blockHashContext,
          activeIndex: state.blockHashContext.hashes.indexOf(action.payload.blockHash)
        }
      };
    }

    case SMART_CONTRACTS_LOAD_SUCCESS: {
      const hashes = [...state.blockHashContext.hashes];
      let activeIndex = state.blockHashContext.activeIndex;
      if (activeIndex === 0) {
        hashes.splice(0, 0, action.payload.previousBlockHash);
        activeIndex++;
      }

      return {
        ...state,
        contracts: [...action.payload.contracts],
        blockHashContext: {
          activeIndex,
          hashes,
        }
      };
    }

    case SMART_CONTRACTS_RESET_BLOCKS: {
      return {
        ...state,
        blockHashContext: {
          hashes: [...action.payload.blocks],
          activeIndex: action.payload.activeIndex
        }
      };
    }

    case SMART_CONTRACTS_RUN:
    case SMART_CONTRACTS_SET_ACTIVE_CONTRACT: {
      return {
        ...state,
        activeContract: action.payload,
        trace: undefined,
        isDebugging: false
      };
    }

    case SMART_CONTRACTS_SET_ACTIVE_CONTRACT_SUCCESS: {
      return {
        ...state,
        activeContract: {
          ...state.activeContract,
          ...action.payload.contract
        },
        trace: action.payload.execution.trace,
        gasTrace: action.payload.execution.gasTrace,
        result: action.payload.execution.result ?? {},
      };
    }

    case SMART_CONTRACTS_GET_TRACE_SUCCESS: {
      return {
        ...state,
        trace: action.payload.trace,
        gasTrace: action.payload.gasTrace,
        result: action.payload.result ?? {},
      };
    }

    case SMART_CONTRACTS_START_DEBUGGING: {
      return {
        ...state,
        isDebugging: true
      };
    }

    case SMART_CONTRACTS_STOP_DEBUGGING: {
      return {
        ...state,
        isDebugging: false,
        debugConfig: {
          previousStep: null,
          currentStep: null,
          nextStep: null,
          stepOver: null,
          stepIn: null,
          stepOut: null
        }
      };
    }

    case SMART_CONTRACTS_DEBUG_STEP: {
      // const currentStep = action.payload;
      // const currentStepIndexInTrace = state.trace.findIndex(t => t === currentStep);
      // const previousStep = currentStepIndexInTrace !== -1 ? state.trace[currentStepIndexInTrace - 1] : undefined;
      // const firstNextStepStartPoint = Math.min(...state.trace
      //   .filter(t => t.start.point > currentStep.stop.point)
      //   .map(t => t.start.point)
      // );
      // const nextStep = state.trace.find(t => t.start.point === firstNextStepStartPoint);
      // const stepsInsideCurrentStep: SmartContractTrace[] = state.trace.filter(
      //   t => t.start.point > currentStep.start.point
      //     && t.stop.point < currentStep.stop.point
      // );
      // const pointOfFirstStepInsideCurrentStep = Math.min(...stepsInsideCurrentStep.map(t => t.start.point));
      // const stepIn = stepsInsideCurrentStep.find(t => t.start.point === pointOfFirstStepInsideCurrentStep);
      // const stepsOutsideCurrentStep: SmartContractTrace[] = state.trace.filter(
      //   t => t.start.point < currentStep.start.point
      //     && t.stop.point > currentStep.stop.point
      // );
      // const outsideStepStartPoint = Math.max(...stepsOutsideCurrentStep.map(t => t.start.point));
      // const stepOut = stepsOutsideCurrentStep.find(t => t.start.point === outsideStepStartPoint);

      const currentStep = action.payload;
      const currentStepIndexInTrace = state.trace.findIndex(t => t === currentStep);
      const previousStep = currentStepIndexInTrace !== -1 ? state.trace[currentStepIndexInTrace - 1] : undefined;

      const stepOver = state.trace.slice(currentStepIndexInTrace).find(
        t => t.start.point > currentStep.stop.point
          || t.start.point < currentStep.start.point && t.stop.point < currentStep.start.point
      );
      const stepsInsideCurrentStep: SmartContractTrace[] = state.trace.filter(
        t => t.start.point > currentStep.start.point
          && t.stop.point < currentStep.stop.point
      );
      const pointOfFirstStepInsideCurrentStep = Math.min(...stepsInsideCurrentStep.map(t => t.start.point));
      const stepIn = stepsInsideCurrentStep.find(t => t.start.point === pointOfFirstStepInsideCurrentStep);
      const stepsOutsideCurrentStep: SmartContractTrace[] = state.trace.filter(
        t => t.start.point < currentStep.start.point
          && t.stop.point > currentStep.stop.point
      );
      const outsideStepStartPoint = Math.max(...stepsOutsideCurrentStep.map(t => t.start.point));
      const stepOut = stepsOutsideCurrentStep.find(t => t.start.point === outsideStepStartPoint);
      const nextStep = state.trace[currentStepIndexInTrace + 1] ?? stepIn;

      return {
        ...state,
        debugConfig: {
          currentStep,
          previousStep,
          stepOver,
          nextStep,
          stepIn,
          stepOut
        }
      };
    }

    default:
      return state;

  }

}
