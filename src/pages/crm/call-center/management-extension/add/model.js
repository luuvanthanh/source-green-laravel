import * as services from './services';

export default {
  namespace: 'crmManagementExtensionAdd',
  state: {
    employees: [],
    details: {},
    error: {
      isError: false,
      data: {},
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
    SET_DETAIL: (state, { payload }) => ({
      ...state,
      details: payload,
    }),
    SET_EMPLOYEES: (state, { payload }) => ({
      ...state,
      employees: payload,
    }),
  },
  effects: {
    *GET_DETAIL({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.details, payload);
        callback(response.parsePayload);
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
        if (response) {
          yield saga.put({
            type: 'SET_EMPLOYEES',
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
    *UPDATE({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateEmployees, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
