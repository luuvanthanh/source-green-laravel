import * as services from './services';

export default {
  namespace: 'crmHistoryCall',
  state: {
    data: [],
    saler: [],
    extensions: [],
    switchboard: [],
    pagination: {
      total: 0,
    },
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
    }),
    SET_SALER: (state, { payload }) => ({
      ...state,
      saler: payload?.parsePayload.map((item) => ({ ...item, name: item.full_name })),
    }),
    SET_EXTENSIONS: (state, { payload }) => ({
      ...state,
      extensions: payload?.parsePayload.map((item) => ({ ...item, name: item.user_id_cmc })),
    }),
    SET_SWITCHBOARD: (state, { payload }) => ({
      ...state,
      switchboard: payload.map((item) => ({ id: item.number, name: item.number })),
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
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DATA',
            payload: response,
          });
        }
        callback(response);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_SALER({ payload }, saga) {
      try {
        const response = yield saga.call(services.getSaler, payload);
        yield saga.put({
          type: 'SET_SALER',
          payload: {
            parsePayload: response.parsePayload,
          },
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_EXTENSIONS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getExtensions, payload);
        yield saga.put({
          type: 'SET_EXTENSIONS',
          payload: {
            parsePayload: response.parsePayload,
          },
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_SWITCHBOARD({ payload }, saga) {
      try {
        const response = yield saga.call(services.getSwitchboard, payload);
        yield saga.put({
          type: 'SET_SWITCHBOARD',
          payload: response.payload,
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
