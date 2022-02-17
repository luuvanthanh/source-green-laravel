import * as services from './services';

  export default {
    namespace: 'currencyPaymentPlan',
    state: {
      data: [],
      year: [],
      dataClass: [],
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
      SET_YEAR: (state, { payload }) => ({
        ...state,
        year: payload.parsePayload,
      }),
      SET_CLASS: (state, { payload }) => ({
        ...state,
        dataClass: payload.items,
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
      *GET_DATA({ payload }, saga) {
        try {
          const response = yield saga.call(services.get, payload);
          yield saga.put({
            type: 'SET_DATA',
            payload: {
              parsePayload: response.parsePayload,
              pagination: response.pagination,
            },
          });
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *GET_YEAR({ payload, callback }, saga) {
        try {
          const response = yield saga.call(services.getYear, payload);
          callback(response);
          yield saga.put({
            type: 'SET_YEAR',
            payload: {
              ...response,
              parsePayload: response.parsePayload,
              pagination: response.pagination,
            },
          });
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *GET_CLASS({ payload }, saga) {
        try {
          const response = yield saga.call(services.getClass, payload);
          yield saga.put({
            type: 'SET_CLASS',
            payload: {
              ...response,
              parsePayload: response.parsePayload,
              pagination: response.pagination,
            },
          });
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *REMOVE({ payload, callback }, saga) {
        try {
          yield saga.call(services.remove, payload.id);
          callback(payload);
        } catch (error) {
          callback(null, error);
        }
      },
    },
    subscriptions: {},
  };
  