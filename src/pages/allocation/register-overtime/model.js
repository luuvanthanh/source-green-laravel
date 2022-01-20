import * as services from './services';

export default {
  namespace: 'registerOvertimeAdd',
  state: {
    data: [],
    details: {},
    year: [],
    detailsTime: {},
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload,
    }),
    SET_YEAR: (state, { payload }) => ({
      ...state,
      year: payload.items,
    }),
    SET_TIME: (state, { payload }) => ({
      ...state,
      detailsTime: payload.items[0],
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
    *ADD_LIMIT({ payload, callback }, saga) {
      try {
        yield saga.call(services.addLimit, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *ADD_TIME({ payload, callback }, saga) {
      try {
        yield saga.call(services.addTime, payload);
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
        yield saga.put({
          type: 'SET_DETAILS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_YEAR({ payload }, saga) {
      try {
        const response = yield saga.call(services.year, payload);
        console.log("year",response);
        yield saga.put({
          type: 'SET_YEAR',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_TIME({ payload }, saga) {
      try {
        const response = yield saga.call(services.getTime, payload);
        console.log("year",response);
        yield saga.put({
          type: 'SET_TIME',
          payload: response,
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
