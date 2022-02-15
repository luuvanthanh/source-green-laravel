import * as services from './services';

export default {
  namespace: 'CRMfeePolicyPolicyAdd',
  state: {
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
  },
  effects: {
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_DETAILS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.details, payload);
        callback(response?.parsePayload);
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
