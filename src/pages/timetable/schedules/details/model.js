import * as services from './services';

export default {
  namespace: 'timeTablesScheduleDetails',
  state: {
    details: {},
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, details: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      details: payload.parsePayload,
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
    *GET_DETAILS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        callback(response);
        yield saga.put({
          type: 'SET_DATA',
          payload: {
            parsePayload: response,
          },
        });
      } catch (error) {
        callback(null, error?.data?.error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
  },
  subscriptions: {},
};
