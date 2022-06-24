import * as categroies from '@/services/categories';
import * as services from './services';

export default {
  namespace: 'manualTimekeepingAdd',
  state: {
    data: [],
    error: {
      isError: false,
      data: {},
    },
    divistions: [],
    shifts: [],
    employees: [],
    pagination: {
      total: 0,
    },
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
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
    }),
    SET_DIVISIONS: (state, { payload }) => ({
      ...state,
      divisions: payload.parsePayload,
    }),
    SET_SHIFTS: (state, { payload }) => ({
      ...state,
      shifts: payload.parsePayload,
    }),
    SET_EMPLOYEES: (state, { payload }) => ({
      ...state,
      employees: payload?.parsePayload.map((i) => ({ ...i, name: i.fullName })),
    }),
  },
  effects: {
    *GET_DIVISIONS({ payload }, saga) {
      try {
        const response = yield saga.call(categroies.getDivisions, payload);
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
    *GET_SHIFTS({ payload }, saga) {
      try {
        const response = yield saga.call(categroies.getShifts, payload);
        yield saga.put({
          type: 'SET_SHIFTS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_EMPLOYEES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getEmployees, payload);
        yield saga.put({
          type: 'SET_EMPLOYEES',
          payload: response,
        });
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
        yield saga.call(services.add, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
