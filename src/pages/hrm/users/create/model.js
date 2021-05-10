// import { variables } from '@/utils';
import { notification } from 'antd';
import * as services from './services';
import * as categories from '@/services/categories';

export default {
  namespace: 'HRMusersAdd',
  state: {
    details: {},
    detailsAccount: {},
    roles: [],
    error: {
      status: null,
      isError: false,
    },
    degrees: [],
    trainningMajors: [],
    trainningSchool: [],
    divisions: [],
    branches: [],
    positions: [],
    dismisseds: [],
    apoints: [],
    transfers: [],
    contractTypes: [],
    contracts: [],
    probationaryContracts: [],
    decisionRewards: [],
    paramaterValues: [],
    paramaterFormulas: [],
    insurrances: [],
  },
  reducers: {
    INIT_STATE: (state) => ({
      ...state,
      details: {},
      detailsAccount: {},
      error: {
        status: null,
        isError: false,
      },
    }),
    SET_DEGREES: (state, { payload }) => ({
      ...state,
      degrees: payload.parsePayload,
    }),
    SET_TRAINNING_MAJORS: (state, { payload }) => ({
      ...state,
      trainningMajors: payload.parsePayload,
    }),
    SET_TRAINNING_SCHOOLS: (state, { payload }) => ({
      ...state,
      trainningSchool: payload.parsePayload,
    }),
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload,
    }),
    SET_DIVISIONS: (state, { payload }) => ({
      ...state,
      divisions: payload.parsePayload,
    }),
    SET_POSITIONS: (state, { payload }) => ({
      ...state,
      positions: payload.parsePayload,
    }),
    SET_DISMISSEDS: (state, { payload }) => ({
      ...state,
      dismisseds: payload.parsePayload,
    }),
    SET_REMOVE_DIMISSEDS: (state, { payload }) => ({
      ...state,
      dismisseds: state.dismisseds.filter((item) => item.id !== payload.id),
    }),
    SET_REMOVE_APPOINTS: (state, { payload }) => ({
      ...state,
      apoints: state.apoints.filter((item) => item.id !== payload.id),
    }),
    SET_APPOINTS: (state, { payload }) => ({
      ...state,
      apoints: payload.parsePayload,
    }),
    SET_TRANSFERS: (state, { payload }) => ({
      ...state,
      transfers: payload.parsePayload,
    }),
    SET_REMOVE_TRANSFERS: (state, { payload }) => ({
      ...state,
      transfers: state.transfers.filter((item) => item.id !== payload.id),
    }),
    SET_DECISION_REWARDS: (state, { payload }) => ({
      ...state,
      decisionRewards: payload.parsePayload,
    }),
    SET_REMOVE_DECISION_REWARDS: (state, { payload }) => ({
      ...state,
      decisionRewards: state.dismisseds.filter((item) => item.id !== payload.id),
    }),
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload.parsePayload,
      error: {
        status: null,
        isError: false,
      },
    }),
    SET_ROLES: (state, { payload }) => ({
      ...state,
      roles: payload.items,
    }),
    SET_DETAILS_ACCOUNT: (state, { payload }) => ({
      ...state,
      detailsAccount: payload,
      error: {
        status: null,
        isError: false,
      },
    }),
    SET_CONTRACT_TYPES: (state, { payload }) => ({
      ...state,
      contractTypes: payload.parsePayload,
    }),
    SET_CONTRACTS: (state, { payload }) => ({
      ...state,
      contracts: payload.parsePayload,
    }),
    SET_PROBATIONARY_CONTRACTS: (state, { payload }) => ({
      ...state,
      probationaryContracts: payload.parsePayload,
    }),
    SET_PARAMATER_VALUES: (state, { payload }) => ({
      ...state,
      paramaterValues: payload.parsePayload,
    }),
    SET_PARAMATER_FORMULAS: (state, { payload }) => ({
      ...state,
      paramaterFormulas: payload.parsePayload,
    }),
    SET_ERROR: (state, { payload }) => ({
      ...state,
      error: {
        isError: true,
        data: {
          ...payload,
        },
      },
    }),
    SET_INSURRANCES: (state, { payload }) => ({
      ...state,
      insurrances: payload.parsePayload,
    }),
    SET_REMOVE_INSURRANCES: (state, { payload }) => ({
      ...state,
      insurrances: state.insurrances.filter((item) => item.id !== payload.id),
    }),
  },
  effects: {
    *ADD({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.add, payload);
        yield saga.call(services.addPositionLevels, {
          ...payload,
          employeeId: response?.parsePayload?.id,
        });
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *ADD_ACCOUNT({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.addAccount, payload);
        callback(response);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành công',
        });
      } catch (error) {
        notification.error({
          message: 'THÔNG BÁO',
          description: error?.data?.error?.message || 'Lỗi hệ thống vui lòng kiểm tra lại',
        });
        callback(null, error?.data?.error);
      }
    },
    *UPDATE({ payload, callback }, saga) {
      try {
        yield saga.call(services.update, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *UPDATE_STATUS({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateStatus, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_DETAILS({ payload }, saga) {
      try {
        yield saga.put({
          type: 'INIT_STATE',
        });
        const response = yield saga.call(services.details, payload);
        yield saga.put({
          type: 'SET_DETAILS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DETAILS_ACCOUNT({ payload }, saga) {
      try {
        yield saga.put({
          type: 'INIT_STATE',
        });
        const response = yield saga.call(services.detailsAccount, payload);
        if (response.status !== 204) {
          yield saga.put({
            type: 'SET_DETAILS_ACCOUNT',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_PARAMATER_VALUES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getParamaterValues, payload);
        yield saga.put({
          type: 'SET_PARAMATER_VALUES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_PARAMATER_FORMULAS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getParamaterFormulas, payload);
        yield saga.put({
          type: 'SET_PARAMATER_FORMULAS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DEGREES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getDegrees, payload);
        yield saga.put({
          type: 'SET_DEGREES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_TRAINNING_MAJORS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getTrainingMajors, payload);
        yield saga.put({
          type: 'SET_TRAINNING_MAJORS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_TRAINNING_SCHOOLS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getTrainingSchools, payload);
        yield saga.put({
          type: 'SET_TRAINNING_SCHOOLS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_BRANCHES({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getBranches, payload);
        yield saga.put({
          type: 'SET_BRANCHES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DIVISIONS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getDivisions, payload);
        yield saga.put({
          type: 'SET_DIVISIONS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_POSITIONS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getPositions, payload);
        yield saga.put({
          type: 'SET_POSITIONS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_ROLES({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getRoles, payload);
        yield saga.put({
          type: 'SET_ROLES',
          payload: response,
        });
      } catch (error) {}
    },
    // dismisseds
    *ADD_DIMISSEDS({ payload, callback }, saga) {
      try {
        yield saga.call(services.addDismisseds, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE_DIMISSEDS({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateDismisseds, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *REMOVE_DIMISSEDS({ payload }, saga) {
      try {
        yield saga.call(services.removeDismisseds, payload);
        yield saga.put({
          type: 'SET_REMOVE_DIMISSEDS',
          payload: payload,
        });
      } catch (error) {}
    },
    *GET_DISMISSEDS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getDismisseds, payload);
        yield saga.put({
          type: 'SET_DISMISSEDS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    // dismisseds
    // appoints
    *ADD_APPOINTS({ payload, callback }, saga) {
      try {
        yield saga.call(services.addAppoints, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE_APPOINTS({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateAppoints, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *REMOVE_APPOINTS({ payload, callback }, saga) {
      try {
        yield saga.call(services.removeAppoints, payload);
        yield saga.put({
          type: 'SET_REMOVE_APPOINTS',
          payload: payload,
        });
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_APPOINTS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getAppoints, payload);
        yield saga.put({
          type: 'SET_APPOINTS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    // appoints
    // transfers
    *ADD_TRANSFERS({ payload, callback }, saga) {
      try {
        yield saga.call(services.addTransfers, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE_TRANSFERS({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateTransfers, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *REMOVE_TRANSFERS({ payload, callback }, saga) {
      try {
        yield saga.call(services.removeTransfers, payload);
        yield saga.put({
          type: 'SET_REMOVE_TRANSFERS',
          payload: payload,
        });
      } catch (error) {}
    },
    *GET_TRANSFERS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getTransfers, payload);
        yield saga.put({
          type: 'SET_TRANSFERS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    // transfers
    // contract
    *GET_CONTRACT_TYPES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getContractTypes, payload);
        yield saga.put({
          type: 'SET_CONTRACT_TYPES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *ADD_CONTRACT({ payload, callback }, saga) {
      try {
        yield saga.call(services.addContract, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_CONTRACTS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getContracts, payload);
        yield saga.put({
          type: 'SET_CONTRACTS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    // contract
    // probationary contract
    *ADD_PROBATIONARY_CONTRACT({ payload, callback }, saga) {
      try {
        yield saga.call(services.addProbationaryContract, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_PROBATIONARY_CONTRACTS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getProbationaryContracts, payload);
        yield saga.put({
          type: 'SET_PROBATIONARY_CONTRACTS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    // probationary contract

    // decision-rewards
    *ADD_DECISION_REWARDS({ payload, callback }, saga) {
      try {
        yield saga.call(services.addDecisionRewards, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE_DECISION_REWARDS({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateDecisionRewards, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *REMOVE_DECISION_REWARDS({ payload, callback }, saga) {
      try {
        yield saga.call(services.removeDecisionRewards, payload);
        yield saga.put({
          type: 'SET_REMOVE_DECISION_REWARDS',
          payload: payload,
        });
      } catch (error) {}
    },
    *GET_DECISION_REWARDS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getDecisionRewards, payload);
        yield saga.put({
          type: 'SET_DECISION_REWARDS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    // decision-rewards
    *FACE_REGISTRATION({ payload, callback }, saga) {
      try {
        yield saga.call(services.faceRegistration, payload);
        callback(payload);
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành công',
        });
      } catch (error) {
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Lỗi hệ thống vui lòng kiểm tra lại',
        });
        callback(null, error?.data?.error);
      }
    },
    // insurrances
    *ADD_INSURRANCES({ payload, callback }, saga) {
      try {
        yield saga.call(services.addInsurrances, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE_INSURRANCES({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateInsurrances, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *REMOVE_INSURRANCES({ payload, callback }, saga) {
      try {
        yield saga.call(services.removeInsurrances, payload);
        yield saga.put({
          type: 'SET_REMOVE_INSURRANCES',
          payload: payload,
        });
      } catch (error) {}
    },
    *GET_INSURRANCES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getInsurrances, payload);
        yield saga.put({
          type: 'SET_INSURRANCES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    // insurrances
  },
  subscriptions: {},
};
