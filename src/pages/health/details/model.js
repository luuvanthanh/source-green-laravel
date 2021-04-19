import * as services from './services';

export default {
  namespace: 'healthDetails',
  state: {
    error: {
      isError: false,
      data: {},
    },
    details: {},
  },
  reducers: {
    INIT_STATE: state => ({ ...state, isError: false, data: [] }),
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload,
    }),
    SET_ERROR: (state, { payload }) => ({
      ...state,
      error: {
        isError: true,
        data: {
          ...payload
        }
      }
    })
  },
  effects: {
    *GET_DETAILS({ payload }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
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
