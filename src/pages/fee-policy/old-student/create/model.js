import * as services from './services';

export default {
  namespace: 'oldStudentAdd',
  state: {
    details: {},
    students: [],
    error: {
      isError: false,
      data: {},
    },
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
    SET_STUDENTS: (state, { payload }) => ({
      ...state,
      students: payload.parsePayload,
      pagination: payload.pagination,
    }),
  },
  effects: {
    *GET_DETAILS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.details, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAILS',
            payload: response?.parsePayload,
          });
          callback(response?.parsePayload);
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
        callback(null, error?.data?.error);
      }
    },
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *UPDATE({ payload, callback }, saga) {
      try {
        yield saga.call(services.update, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_ALL_MONEY({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getAllMoneyFeePolicies, payload);
        callback(response?.payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_MONEY_FEE_POLICIES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.moneyFeePolicies, payload);
        callback(response);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *GET_STUDENTS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getStudent, payload);
        yield saga.put({
          type: 'SET_STUDENTS',
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
  },
  subscriptions: {},
};
