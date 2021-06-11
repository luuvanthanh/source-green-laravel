import * as services from './services';

export default {
  namespace: 'allocationArrangeClass',
  state: {
    data: [],
    pagination: {},
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
  },
  effects: {
    *ADD({ payload, callback }, saga) {
      try {
        const res = yield saga.call(services.createClassStudent, payload);
        callback(res);
      } catch (error) {
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
