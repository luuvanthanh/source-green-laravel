import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'attendanceTimeline',
  state: {
    details: {},
    error: {
      isError: false,
      data: {},
    },
    classTypes: [],
    sensitivePeriods: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      details: payload,
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
    SET_CLASS_TYPES: (state, { payload }) => ({
      ...state,
      classTypes: payload.parsePayload,
    }),
    SET_SENSITIVE_PERIODS: (state, { payload }) => ({
      ...state,
      sensitivePeriods: payload.items,
    }),
  },
  effects: {
    *GET_SENSITIVE_PERIODS({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getSensitivePeriods, payload);
        yield saga.put({
          type: 'SET_SENSITIVE_PERIODS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_CLASS_TYPES({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getClassTypes, payload);
        yield saga.put({
          type: 'SET_CLASS_TYPES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
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
    *REMOVE({ payload, callback }, saga) {
      try {
        yield saga.call(services.remove, payload.id);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
  },
};
