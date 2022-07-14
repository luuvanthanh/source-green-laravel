import * as services from './services';

export default {
  namespace: 'feePolicyRefundstakeABreakAdd',
  state: {
    data: [],
    refund: [],
    pagination: {
      total: 0,
    },
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    SET_REFUND: (state, { payload }) => ({
      ...state,
      refund: payload,
    }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload,
    }),
  },
  effects: {
    *GET_REFUND({ payload }, saga) {
      try {
        const response = yield saga.call(services.getRefund, payload);
        if (response) {
          yield saga.put({
            type: 'SET_REFUND',
            payload: response?.parsePayload,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DATA({ payload }, saga) {
      try {
        const response = yield saga.call(services.getData, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DATA',
            payload: response?.parsePayload,
          });
        }
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
