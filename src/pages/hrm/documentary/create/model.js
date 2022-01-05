import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'HRMdocumentaryAdd',
  state: {
    branches: [],
    divisions: [],
    details: {},
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_ERROR: (state, { payload }) => ({
      ...state,
      error: {
        isError: true,
        data: {
          ...payload,
        },
      },
    }),
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload,
    }),
    SET_DIVISIONS: (state, { payload }) => ({
      ...state,
      divisions: payload.parsePayload,
    }),
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload,
    }),
  },
  effects: {
    *GET_DETAILS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        callback(response);
        yield saga.put({
          type: 'SET_DETAILS',
          payload: response,
        });
      } catch (error) {
        callback(null, error);
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
        const response = yield saga.call(categories.getDivisions, payload);
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
    *GET_EMPLOYEES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(categories.getEmployees, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_PARENTS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(categories.getParents, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
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
  },
  subscriptions: {},
};
