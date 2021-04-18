import { variables } from '@/utils';
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
        yield saga.call(services.add, payload);
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
        callback(null, error?.data?.error);
      }
    },
    // dismisseds
    // transfers
    *ADD_TRANSFERS({ payload, callback }, saga) {
      try {
        yield saga.call(services.addTransfers, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    // transfers
  },
  subscriptions: {},
};
