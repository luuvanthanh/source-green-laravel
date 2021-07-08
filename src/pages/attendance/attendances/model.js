import * as categories from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'attendances',
  state: {
    data: [],
    pagination: {},
    attendancesReasons: [],
    branches: [],
    classes: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
    }),
    SET_ATTENDANCES_REASONS: (state, { payload }) => ({
      ...state,
      attendancesReasons: payload.parsePayload,
    }),
    SET_ADD: (state, { payload }) => ({
      ...state,
      data: state.data.map((item) =>
        item.id === payload.studentId
          ? {
              ...item,
              attendance: [{ ...payload }],
            }
          : item,
      ),
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
    REMOVE_DATA: (state, { payload }) => ({
      ...state,
      data: state.data.filter((item) => item.id !== payload),
    }),
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload,
    }),
    SET_CLASSES: (state, { payload }) => ({
      ...state,
      classes: payload.items,
    }),
  },
  effects: {
    *GET_CLASSES({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getClasses, payload);
        yield saga.put({
          type: 'SET_CLASSES',
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
    *GET_ATTENDANCES_REASONS({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getAttendancesReasons, payload);
        if (response) {
          yield saga.put({
            type: 'SET_ATTENDANCES_REASONS',
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
    *GET_DATA({ payload }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DATA',
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
    *ADD({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.add, payload);
        yield saga.put({
          type: 'SET_ADD',
          payload: {
            ...payload,
            ...response.parsePayload,
          },
        });
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
