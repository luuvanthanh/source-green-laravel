import * as services from './services';

export default {
  namespace: 'crmSaleAssignment',
  state: {
    details: {},
    error: {
      isError: false,
      data: {},
    },
    classorders: [],
    sensitivePeriods: [],
    employees:[],
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
    SET_EMPLOYEES: (state, { payload }) => ({
      ...state,
      employees: payload.parsePayload,
    }),
  },
  effects: {
    *GET_DATA({ payload, callback }, saga) {
      try {
        yield saga.put({
          type: 'INIT_STATE',
        });
        const response = yield saga.call(services.get, payload);
        callback(response);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
        callback(null, error);
      }
    },
    *GET_EMPLOYEES({ payload,callback }, saga) {
      try {
        const response = yield saga.call(services.getEmployees, payload);
        callback(response);
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
    *ASSIGNMENT({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.assignment, payload);
        callback(response);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
        callback(null, error);
      }
    }
  },
};
