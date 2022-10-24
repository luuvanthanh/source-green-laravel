import * as services from './services';

export default {
  namespace: 'childDevelopConfigurationLogo',
  state: {
    details: [],
    roles: [],
    error: {
      status: null,
      isError: false,
    },
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
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload.parsePayload,
      error: {
        status: null,
        isError: false,
      },
    }),
  },
  effects: {
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
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
  },
  subscriptions: {},
};
