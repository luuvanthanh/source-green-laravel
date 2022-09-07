import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'physicalCreate',
  state: {
    branches: [],
    classes: [],
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
    SET_CLASSES: (state, { payload }) => ({
      ...state,
      classes: payload,
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
      const response = yield saga.call(categories.getBranches, payload);
      yield saga.put({
        type: 'SET_BRANCHES',
        payload: response,
      });
    },
    *GET_CLASSES({ payload }, saga) {
      const response = yield saga.call(categories.getClasses, payload);
      yield saga.put({
        type: 'SET_CLASSES',
        payload: response?.items || [],
      });
    },
    *GET_STUDENTS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
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
  },
  subscriptions: {},
};
