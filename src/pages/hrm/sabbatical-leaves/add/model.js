import * as services from './services';

export default {
  namespace: 'sabbaticalLeavesAdd',
  state: {
    data: [],
    pagination: {
      total: 0,
    },
    categories: {
      users: [],
    },
    details: {},
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
      details: payload,
    }),
    SET_CATEGORIES: (state, { payload }) => ({
      ...state,
      categories: {
        users: payload.users.parsePayload,
      },
    }),
  },
  effects: {
    *GET_CATEGORIES({ _ }, saga) {
      try {
        const response = yield saga.all({
          users: saga.call(services.getUsers),
        });
        yield saga.put({
          type: 'SET_CATEGORIES',
          payload: response,
        });
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
    *UPDATE({ payload, callback }, saga) {
      try {
        yield saga.call(services.update, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_DETAILS({ payload }, saga) {
      try {
        const response = yield saga.call(services.details, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAILS',
            payload: response.parsePayload,
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
