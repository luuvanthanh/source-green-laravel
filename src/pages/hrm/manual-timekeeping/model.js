import * as services from './services';

export default {
  namespace: 'manualTimekeeping',
  state: {
    data: [],
    employees: [],
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
    SET_EMPLOYEES: (state, { payload }) => ({
      ...state,
      employees: payload.parsePayload?.map((i) => ({ ...i, name: i.fullName })),
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
    *GET_EMPLOYEES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getEmployees, payload);
        if (response) {
          yield saga.put({
            type: 'SET_EMPLOYEES',
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
