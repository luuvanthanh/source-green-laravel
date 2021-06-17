import * as services from './services';

export default {
  namespace: 'allocationTeacherNoClass',
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
        const res = yield saga.call(services.add, payload);
        callback(res);
      } catch (error) {
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
