import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'timeTablesScheduleAdd',
  state: {
    branches: [],
    error: {
      isError: false,
      data: {},
    },
    classes: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload,
    }),
    SET_CLASSES: (state, { payload }) => ({
      ...state,
      classes: payload.items,
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
    *GET_CLASSES({ payload }, saga) {
      const response = yield saga.call(categories.getClasses, payload);
      yield saga.put({
        type: 'SET_CLASSES',
        payload: response,
      });
    },
    *GET_BRANCHES({ payload }, saga) {
      const response = yield saga.call(categories.getBranches, payload);
      yield saga.put({
        type: 'SET_BRANCHES',
        payload: response,
      });
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
    *GET_STUDENTS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getStudents, payload);
        callback(response);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
  },
  subscriptions: {},
};
