// import { variables } from '@/utils';
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
    SET_APPOINTS: (state, { payload }) => ({
      ...state,
      apoints: payload.parsePayload,
    }),
    SET_TRANSFERS: (state, { payload }) => ({
      ...state,
      transfers: payload.parsePayload,
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
      contractTypes: payload.parsePayload
    }),
    SET_CONTRACTS: (state, { payload }) => ({
      ...state,
      contracts: payload.parsePayload,
    }),
    SET_PROBATIONARY_CONTRACTS: (state, { payload }) => ({
      ...state,
      probationaryContracts: payload.parsePayload,
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
        callback(null, error?.data?.error);
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
        yield saga.put({
          type: 'SET_DETAILS_ACCOUNT',
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
        const response = yield saga.call(services.getBranches, payload);
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
  },
  subscriptions: {},
};
