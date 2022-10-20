import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'otherDeclarationsAdd',
  state: {
    data: [],
    pagination: {
      total: 0,
    },
    categories: {
      users: [],
      absentTypes: [],
      paramaterValues: [],
      paramaterContract: [],
    },
    details: {},
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
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
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload,
    }),
    SET_CATEGORIES: (state, { payload }) => ({
      ...state,
      categories: {
        users: payload.users.parsePayload,
        paramaterValues: payload.paramaterValues.parsePayload,
        paramaterContract: payload.paramaterContract.parsePayload,
      },
    }),
  },
  effects: {
    *GET_CATEGORIES({ _ }, saga) {
      try {
        const response = yield saga.all({
          users: saga.call(categories.getUsers),
          paramaterValues: saga.call(services.getParamaterValues),
          paramaterContract: saga.call(services.getParamaterValuesTypeContract),
        });
        yield saga.put({
          type: 'SET_CATEGORIES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE({ payload, callback }, saga) {
      try {
        yield saga.call(services.update, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_DETAILS({ payload }, saga) {
      try {
        const response = yield saga.call(services.details, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAILS',
            payload: response.parsePayload,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_WORK({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getWork, payload);
        callback(response);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
  },
  subscriptions: {},
};
