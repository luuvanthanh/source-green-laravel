import * as services from './services';

export default {
  namespace: 'crmManagementCall',
  state: {
    data: [],
    lead: [],
    isCall: false,
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
    SET_ERROR: (state, { payload }) => ({
      ...state,
      error: {
        isError: true,
        data: {
          ...payload,
        },
      },
    }),
    SET_STATUS_LEAD: (state, { payload }) => ({
      ...state,
      lead: payload.parsePayload,
    }),
    SET_IS_CALL: (state, { payload }) => ({
      ...state,
      isCall: payload,
    }),
  },
  effects: {
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
    *GET_COUNTCALL({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getCountCall, payload);
        callback(response?.payload);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_STATUS_LEAD({ payload }, saga) {
      try {
        const response = yield saga.call(services.getStatusLead, payload);
        yield saga.put({
          type: 'SET_STATUS_LEAD',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *IS_CALL({ payload, callback }, saga) {
      yield saga.put({
        type: 'SET_IS_CALL',
        payload,
      });
      callback();
    },
  },
  subscriptions: {},
};
