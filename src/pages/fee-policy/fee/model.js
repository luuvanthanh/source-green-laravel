import * as services from './services';

export default {
  namespace: 'feePolicyFee',
  state: {
    data: [{ id: 1 }],
    pagination: {
      total: 0
    },
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: state => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination
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
    *GET_DATA({ payload }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        yield saga.put({
          type: 'SET_DATA',
          payload: {
            parsePayload: response.items,
            pagination: {
              total: response.totalCount
            }
          },
        });a
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data
        });
      }
    },
  },
  subscriptions: {},
};
