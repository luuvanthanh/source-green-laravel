import * as services from './services';

export default {
  namespace: 'hrmRecruitmentWebForm',
  state: {
    data: {},
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
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
    }),
  },
  effects: {
    *GET_DATA({ payload,callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        callback(response?.parsePayload);
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
