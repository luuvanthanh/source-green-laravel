import * as services from './services';

export default {
  namespace: 'communicationsApprove',
  state: {
    data: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
    }),
    SET_UPDATE: (state, { payload }) => ({
      ...state,
      data: state.data.map((item) => {
        if (item.id === payload.communicationId) {
          return {
            ...item,
            feedbacks: item.feedbacks.map((itemFeedback) =>
              itemFeedback.id === payload.id ? payload : itemFeedback,
            ),
          };
        }
        return item;
      }),
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
  },
  effects: {
    *GET_DATA({ payload }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        yield saga.put({
          type: 'SET_DATA',
          payload: {
            parsePayload: response.items,
          },
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *UPDATE({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.update, payload);
        yield saga.put({
          type: 'SET_UPDATE',
          payload: response,
        });
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
  },
  subscriptions: {},
};
