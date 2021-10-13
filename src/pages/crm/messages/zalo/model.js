import * as services from './services';

export default {
  namespace: 'crmZalo',
  state: {
    data: [],
    pagination: {
      total: 0,
    },
    error: {
      isError: false,
      data: {},
    },
    user: {},
    pages: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
    }),
    SET_USER: (state, { payload }) => ({
      ...state,
      user: payload,
    }),
    SET_PAGES: (state, { payload }) => ({
      ...state,
      pages: payload.data,
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
    *GET_USER({ payload }, { put }) {
      try {
        yield put({
          type: 'SET_USER',
          payload,
        });
      } catch (error) {
        yield put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_PAGES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getPages, payload);
        yield saga.put({
          type: 'SET_PAGES',
          payload: response,
        });
        callback(response);
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_CONVERSATIONS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getConversations, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_MESSAGES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getMessages, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *SEND_MESSAGES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.sendMessages, payload);
        callback(response);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_DATA({ payload }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
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
  },
  subscriptions: {},
};
