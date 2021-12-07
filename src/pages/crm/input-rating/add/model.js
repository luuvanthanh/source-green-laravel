import * as services from './services';

  export default {
    namespace: 'crmInputRatingAdd',
    state: {
      error: {
        isError: false,
        data: {},
      },
      details: {},
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
        details: payload,
      }),
    },
    effects: {
      // *GET_DETAILS({ payload }, saga) {
      //   try {
      //     const response = yield saga.call(services.get, payload);
      //     yield saga.put({
      //       type: 'SET_DETAILS',
      //       payload: response,
      //     });
      //   } catch (error) {
      //     yield saga.put({
      //       type: 'SET_ERROR',
      //       payload: error.data,
      //     });
      //   }
      // },
      *REMOVE({ payload, callback }, saga) {
        try {
          yield saga.call(services.remove, payload);
          callback(payload);
        } catch (error) {
          callback(null, error);
        }
      },
    },
    subscriptions: {},
  };
  