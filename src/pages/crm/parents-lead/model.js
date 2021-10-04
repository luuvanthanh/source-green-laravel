import * as services from './services';

  export default {
    namespace: 'crmParentsLead',
    state: {
      data: [],
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
    },
  };