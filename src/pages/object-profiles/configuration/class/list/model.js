import * as services from './services';

export default {
  namespace: 'classesList',
  state: {
    data: [],
    dataDetails: [],
    error: {
      isError: false,
      data: {},
    },
    branches: [],
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
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      data: payload,
    }),
    SET_DATA_DETAILS: (state, { payload }) => ({
      ...state,
      dataDetails: payload,
    }),
  },
  effects: {
    *GET_DATA({ payload }, saga) {
      try {
        const response = yield saga.call(services.getData, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAILS',
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
    *GET_DATA_DETAILS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getDataDetail, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DATA_DETAILS',
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
  },
  subscriptions: {},
};
