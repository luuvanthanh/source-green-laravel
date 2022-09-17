import * as services from './services';

export default {
  namespace: 'physicalDetails',
  state: {
    details: {},
    error: {
      isError: false,
      data: {},
    },
    physicals: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      details: payload.parsePayload,
      error: {
        isError: false,
        data: {},
      },
    }),
    SET_PHYSICAL: (state, { payload }) => ({
      ...state,
      physicals: payload,
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
    *GET_DETAILS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getDetails, payload);
        yield saga.put({
          type: 'SET_DATA',
          payload: {
            parsePayload: response,
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
        yield saga.call(services.update, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_PHYSICAL({ payload }, saga) {
      try {
        const response = yield saga.call(services.getPhysical, payload);
        yield saga.put({
          type: 'SET_PHYSICAL',
          payload: response.items,
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
