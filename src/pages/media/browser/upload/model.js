import * as services from './services';

export default {
  namespace: 'mediaUpload',
  state: {},
  reducers: {},
  effects: {
    *UPLOAD({ payload, callback }, { call }) {
      try {
        const response = yield call(services.upload, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *CREATE({ payload, callback }, { call }) {
      try {
        const response = yield call(services.create, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};
