import * as services from './services';

export default {
  namespace: 'notificationModule',
  state: {
    data: [],
    pagination: {
      total: 0,
    },
    error: {
      isError: false,
      data: {},
    },
    types: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
    }),
    SET_TYPES: (state, { payload }) => ({
      ...state,
      types: payload.items,
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
    UPDATE_DATA: (state, { payload }) => ({
      ...state,
      data: state.data.map((item) =>
        item.id === payload.id ? { ...item, status: payload.status } : item,
      ),
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
            pagination: {
              total: response.totalCount,
            },
          },
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_TYPES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getTypes, payload);
        yield saga.put({
          type: 'SET_TYPES',
          payload: response,
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
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
  },
  subscriptions: {},
};
